import { markOrderPaid } from "@/lib/checkout";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { token?: string; success?: boolean };
    const token = String(body.token ?? "");
    if (!token) {
      return Response.json({ ok: false, message: "شناسهٔ سفارش نامعتبر است." }, { status: 400 });
    }
    /**
     * در حالت اتصال به درگاه واقعی (زرین‌پال)، Authority و Status از کوئری‌استرینگ
     * درگاه خوانده می‌شود و در این نقطه verify می‌شود. در این نسخهٔ دمو، نتیجهٔ
     * پرداخت به‌صورت امن از سمت سرور ثبت می‌شود.
     */
    const order = await markOrderPaid(token, body.success !== false);
    if (!order) {
      return Response.json({ ok: false, message: "سفارش پیدا نشد." }, { status: 404 });
    }
    return Response.json({
      ok: true,
      redirect: `/orders/${token}?result=${body.success === false ? "failed" : "paid"}`,
      smsStatus: order.smsStatus,
    });
  } catch (error) {
    console.error("payment verify", error);
    return Response.json({ ok: false, message: "خطا در تأیید پرداخت." }, { status: 500 });
  }
}
