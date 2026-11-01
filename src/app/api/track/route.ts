import { db } from "@/db";
import { orders } from "@/db/schema";
import { desc, eq, or } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") ?? "").trim();
    if (q.length < 4) {
      return Response.json({ ok: false, message: "شمارهٔ سفارش یا موبایل را کامل وارد کنید." }, { status: 400 });
    }
    const normalized = q.replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)));
    const rows = await db
      .select({
        token: orders.token,
        orderNumber: orders.orderNumber,
        status: orders.status,
        createdAt: orders.createdAt,
      })
      .from(orders)
      .where(or(eq(orders.orderNumber, normalized), eq(orders.phone, normalized)))
      .orderBy(desc(orders.createdAt))
      .limit(5);
    if (rows.length === 0) {
      return Response.json({ ok: false, message: "سفارشی با این مشخصات پیدا نشد." }, { status: 404 });
    }
    return Response.json({ ok: true, orders: rows });
  } catch {
    return Response.json({ ok: false, message: "خطا در جست‌وجوی سفارش." }, { status: 500 });
  }
}
