import { db } from "@/db";
import { coupons, orderItems, orders, productImages, products, variants } from "@/db/schema";
import { and, eq, gte, inArray, sql } from "drizzle-orm";
import { getShippingMethod, FREE_SHIPPING_THRESHOLD } from "./format";
import { sendOrderSms } from "./sms";

export type CartItemInput = { variantId: number; qty: number };

export type ResolvedLine = {
  variantId: number;
  productId: number;
  name: string;
  slug: string;
  image: string | null;
  size: string;
  colorName: string;
  unitPrice: number;
  qty: number;
  lineTotal: number;
  stock: number;
};

export async function resolveCart(items: CartItemInput[]) {
  const clean = items
    .filter((item) => Number.isInteger(item.variantId) && item.variantId > 0)
    .map((item) => ({ variantId: item.variantId, qty: Math.min(10, Math.max(1, Math.floor(item.qty) || 1)) }));
  if (clean.length === 0) return { lines: [] as ResolvedLine[], issues: [] as string[] };

  const rows = await db
    .select({
      variant: variants,
      product: products,
    })
    .from(variants)
    .innerJoin(products, eq(variants.productId, products.id))
    .where(eq(products.isActive, true));

  const issues: string[] = [];
  const lines: ResolvedLine[] = [];
  for (const item of clean) {
    const found = rows.find((row) => row.variant.id === item.variantId);
    if (!found) {
      issues.push("یکی از اقلام سبد خرید دیگر موجود نیست.");
      continue;
    }
    if (found.variant.stock < item.qty) {
      issues.push(`موجودی ${found.product.name} (${found.variant.size}) کافی نیست.`);
      continue;
    }
    const image = null;
    lines.push({
      variantId: found.variant.id,
      productId: found.product.id,
      name: found.product.name,
      slug: found.product.slug,
      image,
      size: found.variant.size,
      colorName: found.variant.colorName,
      unitPrice: found.product.price,
      qty: item.qty,
      lineTotal: found.product.price * item.qty,
      stock: found.variant.stock,
    });
  }
  return { lines, issues };
}

export type CouponResult =
  | { ok: true; code: string; discount: number; label: string }
  | { ok: false; discount: 0; message: string };

export async function evaluateCoupon(rawCode: string, subtotal: number): Promise<CouponResult> {
  const code = rawCode.trim().toUpperCase();
  if (!code) return { ok: false, discount: 0, message: "کد تخفیف را وارد کنید." };
  const [coupon] = await db.select().from(coupons).where(eq(coupons.code, code)).limit(1);
  if (!coupon || !coupon.active) {
    return { ok: false, discount: 0, message: "این کد تخفیف معتبر نیست." };
  }
  if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
    return { ok: false, discount: 0, message: "ظرفیت استفاده از این کد تکمیل شده است." };
  }
  if (subtotal < coupon.minSubtotal) {
    return {
      ok: false,
      discount: 0,
      message: `این کد برای سبد بالای ${new Intl.NumberFormat("fa-IR").format(
        coupon.minSubtotal,
      )} تومان فعال است.`,
    };
  }
  let discount =
    coupon.type === "percent" ? Math.round((subtotal * coupon.value) / 100) : coupon.value;
  if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
  discount = Math.min(discount, subtotal);
  const label =
    coupon.type === "percent"
      ? `${coupon.value}٪ تخفیف`
      : `${new Intl.NumberFormat("fa-IR").format(coupon.value)} تومان تخفیف`;
  return { ok: true, code: coupon.code, discount, label };
}

export function computeTotals(input: {
  subtotal: number;
  discount: number;
  shippingMethod: string;
}) {
  const method = getShippingMethod(input.shippingMethod);
  const isFreeShipping = input.subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingCost = isFreeShipping ? 0 : method.cost;
  const total = Math.max(0, input.subtotal - input.discount) + shippingCost;
  return { shippingCost, isFreeShipping, total, method };
}

export type CheckoutPayload = {
  items: CartItemInput[];
  customerName: string;
  phone: string;
  email?: string;
  province: string;
  city: string;
  address: string;
  postalCode?: string;
  note?: string;
  shippingMethod: string;
  couponCode?: string;
};

export type CreateOrderResult =
  | { ok: true; token: string; orderNumber: string; total: number; paymentUrl: string }
  | { ok: false; message: string; issues?: string[] };

export async function createOrder(payload: CheckoutPayload): Promise<CreateOrderResult> {
  if (!payload.customerName?.trim() || payload.customerName.trim().length < 3) {
    return { ok: false, message: "نام و نام خانوادگی را کامل وارد کنید." };
  }
  if (!/^09\d{9}$/.test(payload.phone?.trim() ?? "")) {
    return { ok: false, message: "شمارهٔ موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد." };
  }
  if (!payload.province?.trim() || !payload.city?.trim() || (payload.address?.trim().length ?? 0) < 10) {
    return { ok: false, message: "استان، شهر و نشانی کامل را وارد کنید." };
  }

  const { lines, issues } = await resolveCart(payload.items);
  if (lines.length === 0) {
    return { ok: false, message: "سبد خرید خالی است یا موجودی آن تغییر کرده.", issues };
  }

  const productIds = [...new Set(lines.map((line) => line.productId))];
  const imageRows = productIds.length
    ? await db
        .select()
        .from(productImages)
        .where(inArray(productImages.productId, productIds))
    : [];
  const imageMap = new Map<number, string>();
  for (const row of imageRows) {
    if (!imageMap.has(row.productId)) imageMap.set(row.productId, row.url);
  }

  const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
  let discount = 0;
  let couponCode: string | null = null;
  if (payload.couponCode) {
    const coupon = await evaluateCoupon(payload.couponCode, subtotal);
    if (coupon.ok) {
      discount = coupon.discount;
      couponCode = coupon.code;
    }
  }
  const totals = computeTotals({ subtotal, discount, shippingMethod: payload.shippingMethod });

  const token = crypto.randomUUID();
  const orderNumber = `TRM-${new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    calendar: "persian",
    numberingSystem: "latn",
  })
    .formatToParts(new Date())
    .find((part) => part.type === "year")?.value ?? "1404"}-${Math.floor(
    1000 + Math.random() * 9000,
  )}`;

  try {
    const created = await db.transaction(async (tx) => {
      for (const line of lines) {
        const updated = await tx
          .update(variants)
          .set({ stock: sql`${variants.stock} - ${line.qty}` })
          .where(and(eq(variants.id, line.variantId), gte(variants.stock, line.qty)))
          .returning({ id: variants.id });
        if (updated.length === 0) {
          throw new Error(`INSUFFICIENT:${line.name}`);
        }
      }

      const [order] = await tx
        .insert(orders)
        .values({
          token,
          orderNumber,
          customerName: payload.customerName.trim(),
          phone: payload.phone.trim(),
          email: payload.email?.trim() || null,
          province: payload.province.trim(),
          city: payload.city.trim(),
          address: payload.address.trim(),
          postalCode: payload.postalCode?.trim() || null,
          note: payload.note?.trim() || null,
          shippingMethod: totals.method.id,
          shippingCost: totals.shippingCost,
          subtotal,
          discount,
          total: totals.total,
          couponCode,
          paymentStatus: "pending",
          status: "pending",
          carrier: totals.method.carrier,
        })
        .returning();

      await tx.insert(orderItems).values(
        lines.map((line) => ({
          orderId: order.id,
          productId: line.productId,
          variantId: line.variantId,
          name: line.name,
          slug: line.slug,
          image: imageMap.get(line.productId) ?? null,
          size: line.size,
          colorName: line.colorName,
          unitPrice: line.unitPrice,
          qty: line.qty,
          lineTotal: line.lineTotal,
        })),
      );

      if (couponCode) {
        await tx
          .update(coupons)
          .set({ usedCount: sql`${coupons.usedCount} + 1` })
          .where(eq(coupons.code, couponCode));
      }

      return order;
    });

    return {
      ok: true,
      token: created.token,
      orderNumber: created.orderNumber,
      total: created.total,
      paymentUrl: `/pay/${created.token}`,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message.startsWith("INSUFFICIENT:")) {
      return {
        ok: false,
        message: `موجودی ${message.replace("INSUFFICIENT:", "")} در این لحظه تکمیل شد. لطفاً سبد را بازبینی کنید.`,
      };
    }
    console.error("createOrder failed", error);
    return { ok: false, message: "ثبت سفارش با خطا مواجه شد. لطفاً دوباره تلاش کنید." };
  }
}

export async function markOrderPaid(token: string, success: boolean) {
  const [order] = await db.select().from(orders).where(eq(orders.token, token)).limit(1);
  if (!order) return null;
  if (order.paymentStatus === "paid") return order;

  if (!success) {
    const [failed] = await db
      .update(orders)
      .set({ paymentStatus: "failed", updatedAt: new Date() })
      .where(eq(orders.id, order.id))
      .returning();
    return failed;
  }

  const trackingCode = `${order.shippingMethod === "tipax" ? "TX" : "IR"}${Math.floor(
    100000000 + Math.random() * 899999999,
  )}`;
  const [paid] = await db
    .update(orders)
    .set({
      paymentStatus: "paid",
      status: "processing",
      trackingCode,
      updatedAt: new Date(),
    })
    .where(eq(orders.id, order.id))
    .returning();

  const smsStatus = await sendOrderSms(
    paid.phone,
    `ترمه | سفارش ${paid.orderNumber} با موفقیت ثبت شد. مبلغ: ${new Intl.NumberFormat("fa-IR").format(
      paid.total,
    )} تومان. کد رهگیری: ${trackingCode}`,
  );
  await db.update(orders).set({ smsStatus }).where(eq(orders.id, paid.id));
  return { ...paid, smsStatus };
}

export async function updateOrderStatus(
  id: number,
  data: { status?: string; trackingCode?: string; carrier?: string },
) {
  const [updated] = await db
    .update(orders)
    .set({
      ...(data.status ? { status: data.status } : {}),
      ...(data.trackingCode !== undefined ? { trackingCode: data.trackingCode || null } : {}),
      ...(data.carrier !== undefined ? { carrier: data.carrier || null } : {}),
      updatedAt: new Date(),
    })
    .where(eq(orders.id, id))
    .returning();
  return updated ?? null;
}
