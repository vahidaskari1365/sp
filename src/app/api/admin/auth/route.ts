import { checkPassword, clearAdminCookie, setAdminCookie } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { password?: string };
    if (!checkPassword(String(body.password ?? ""))) {
      return Response.json({ ok: false, message: "رمز عبور نادرست است." }, { status: 401 });
    }
    await setAdminCookie();
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, message: "خطا در ورود." }, { status: 500 });
  }
}

export async function DELETE() {
  await clearAdminCookie();
  return Response.json({ ok: true });
}
