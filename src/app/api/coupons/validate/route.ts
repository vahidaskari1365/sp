import { evaluateCoupon } from "@/lib/checkout";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { code?: string; subtotal?: number };
    const subtotal = Math.max(0, Number(body.subtotal) || 0);
    const result = await evaluateCoupon(String(body.code ?? ""), subtotal);
    return Response.json(
      result.ok
        ? { ok: true, discount: result.discount, label: result.label, code: result.code }
        : { ok: false, message: result.message },
      { status: result.ok ? 200 : 400 },
    );
  } catch {
    return Response.json({ ok: false, message: "کد تخفیف بررسی نشد." }, { status: 500 });
  }
}
