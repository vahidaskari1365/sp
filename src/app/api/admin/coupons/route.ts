import { db } from "@/db";
import { coupons } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdmin())) return Response.json({ ok: false }, { status: 401 });
  const rows = await db.select().from(coupons).orderBy(desc(coupons.createdAt));
  return Response.json({ ok: true, coupons: rows });
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return Response.json({ ok: false }, { status: 401 });
  try {
    const body = (await request.json()) as {
      code?: string;
      type?: string;
      value?: number | string;
      minSubtotal?: number | string;
      maxDiscount?: number | string | null;
      maxUses?: number | string;
    };
    const code = String(body.code ?? "").trim().toUpperCase();
    const value = Math.max(0, Math.round(Number(body.value) || 0));
    const type = body.type === "fixed" ? "fixed" : "percent";
    if (!/^[A-Z0-9_-]{3,24}$/.test(code)) {
      return Response.json({ ok: false, message: "کد باید بین ۳ تا ۲۴ کاراکتر انگلیسی باشد." }, { status: 400 });
    }
    if (value <= 0) {
      return Response.json({ ok: false, message: "مقدار تخفیف را وارد کنید." }, { status: 400 });
    }
    if (type === "percent" && value > 90) {
      return Response.json({ ok: false, message: "درصد تخفیف نمی‌تواند بیش از ۹۰ باشد." }, { status: 400 });
    }
    const existing = await db.select().from(coupons).where(eq(coupons.code, code)).limit(1);
    if (existing.length) {
      return Response.json({ ok: false, message: "این کد قبلاً ثبت شده است." }, { status: 400 });
    }
    const [created] = await db
      .insert(coupons)
      .values({
        code,
        type,
        value,
        minSubtotal: Math.max(0, Math.round(Number(body.minSubtotal) || 0)),
        maxDiscount: body.maxDiscount ? Math.max(0, Math.round(Number(body.maxDiscount))) : null,
        maxUses: Math.max(0, Math.round(Number(body.maxUses) || 0)),
        active: true,
      })
      .returning();
    return Response.json({ ok: true, coupon: created });
  } catch (error) {
    console.error("admin coupon create", error);
    return Response.json({ ok: false, message: "ثبت کد تخفیف انجام نشد." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!(await isAdmin())) return Response.json({ ok: false }, { status: 401 });
  try {
    const body = (await request.json()) as { id?: number; active?: boolean };
    const id = Number(body.id);
    if (!id) return Response.json({ ok: false }, { status: 400 });
    const [updated] = await db
      .update(coupons)
      .set({ active: Boolean(body.active) })
      .where(eq(coupons.id, id))
      .returning();
    return Response.json({ ok: true, coupon: updated });
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await isAdmin())) return Response.json({ ok: false }, { status: 401 });
  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("id"));
    if (!id) return Response.json({ ok: false }, { status: 400 });
    await db.delete(coupons).where(eq(coupons.id, id));
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}
