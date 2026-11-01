import { db } from "@/db";
import { subscribers } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { phone?: string };
    const phone = String(body.phone ?? "").trim();
    if (!/^09\d{9}$/.test(phone)) {
      return Response.json({ ok: false, message: "شمارهٔ موبایل معتبر نیست." }, { status: 400 });
    }
    await db.insert(subscribers).values({ phone }).onConflictDoNothing();
    return Response.json({ ok: true });
  } catch (error) {
    console.error("newsletter", error);
    return Response.json({ ok: false }, { status: 500 });
  }
}
