import { isAdmin } from "@/lib/auth";
import { updateOrderStatus } from "@/lib/checkout";

export const dynamic = "force-dynamic";

const ALLOWED = ["pending", "processing", "shipped", "delivered", "canceled"];

export async function PATCH(request: Request) {
  if (!(await isAdmin())) return Response.json({ ok: false }, { status: 401 });
  try {
    const body = (await request.json()) as {
      id?: number;
      status?: string;
      trackingCode?: string;
      carrier?: string;
    };
    const id = Number(body.id);
    if (!id) return Response.json({ ok: false, message: "شناسه لازم است." }, { status: 400 });
    const status = body.status && ALLOWED.includes(body.status) ? body.status : undefined;
    const updated = await updateOrderStatus(id, {
      status,
      trackingCode: body.trackingCode,
      carrier: body.carrier,
    });
    if (!updated) return Response.json({ ok: false }, { status: 404 });
    return Response.json({ ok: true, order: updated });
  } catch (error) {
    console.error("admin order update", error);
    return Response.json({ ok: false, message: "به‌روزرسانی سفارش انجام نشد." }, { status: 500 });
  }
}
