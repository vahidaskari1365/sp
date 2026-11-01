import { createOrder, type CheckoutPayload } from "@/lib/checkout";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<CheckoutPayload>;
    if (!Array.isArray(body.items)) {
      return Response.json({ ok: false, message: "سبد خرید نامعتبر است." }, { status: 400 });
    }
    const payload: CheckoutPayload = {
      items: body.items
        .filter((item) => Number.isInteger(item?.variantId) && Number.isInteger(item?.qty))
        .map((item) => ({ variantId: Number(item.variantId), qty: Number(item.qty) })),
      customerName: String(body.customerName ?? ""),
      phone: String(body.phone ?? ""),
      email: body.email ? String(body.email) : undefined,
      province: String(body.province ?? ""),
      city: String(body.city ?? ""),
      address: String(body.address ?? ""),
      postalCode: body.postalCode ? String(body.postalCode) : undefined,
      note: body.note ? String(body.note) : undefined,
      shippingMethod: String(body.shippingMethod ?? "post"),
      couponCode: body.couponCode ? String(body.couponCode) : undefined,
    };
    const result = await createOrder(payload);
    return Response.json(result, { status: result.ok ? 200 : 400 });
  } catch (error) {
    console.error("POST /api/orders", error);
    return Response.json(
      { ok: false, message: "خطای سرور در ثبت سفارش. لطفاً دوباره تلاش کنید." },
      { status: 500 },
    );
  }
}
