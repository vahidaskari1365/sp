"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await response.json()) as { ok: boolean; message?: string };
      if (!data.ok) {
        setError(data.message ?? "ورود ناموفق بود.");
        setLoading(false);
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("خطا در ارتباط با سرور.");
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-[calc(100vh-112px)] lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-ink lg:block">
        <Image
          src="https://images.pexels.com/photos/21855757/pexels-photo-21855757.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200&h=1500"
          alt="آتلیهٔ ترمه"
          fill
          sizes="50vw"
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-10 text-bone">
          <p className="font-latin text-[11px] tracking-[0.4em] text-gold">TERMEH STUDIO</p>
          <h1 className="mt-3 text-3xl font-black leading-relaxed">
            پنل مدیریت فروشگاه
            <br />
            محصول، سفارش، موجودی.
          </h1>
          <p className="mt-3 max-w-sm text-[12px] leading-7 text-bone/60">
            همهٔ آنچه برای ادارهٔ روزانهٔ یک برند پوشاک لازم دارید: افزودن محصول، ویرایش
            موجودی ترکیب سایز و رنگ، مدیریت سفارش‌ها و کدهای تخفیف.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-sm">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-full bg-ink text-bone">
              <span className="font-latin text-lg">T</span>
            </span>
            <span>
              <span className="block text-lg font-extrabold">ترمه</span>
              <span className="font-latin block text-[9px] tracking-[0.32em] text-ink-muted">
                ADMIN PANEL
              </span>
            </span>
          </Link>

          <h2 className="mt-8 text-2xl font-black">ورود به پنل</h2>
          <p className="mt-1 text-[11.5px] leading-6 text-ink-muted">
            رمز مدیریت را وارد کنید. نشست شما به مدت ۱۴ روز فعال می‌ماند.
          </p>

          <form onSubmit={submit} className="mt-5 space-y-3">
            <div>
              <label htmlFor="password" className="mb-1 block text-[11px] text-ink-soft">
                رمز عبور
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="field"
                placeholder="••••••••"
                required
                autoFocus
              />
            </div>
            {error && <p className="text-[11px] text-clay">{error}</p>}
            <button type="submit" disabled={loading} className="btn btn-clay w-full text-[13px] disabled:opacity-60">
              {loading ? "در حال ورود…" : "ورود به پنل"}
            </button>
          </form>

          <div className="mt-5 rounded-xl border border-line bg-bone-deep/50 px-3 py-2.5 text-[10.5px] leading-6 text-ink-muted">
            رمز نسخهٔ نمایشی: <b className="font-latin text-ink">termeh1404</b>
            <br />
            در محیط واقعی مقدار <span className="font-latin">ADMIN_PASSWORD</span> را در
            فایل محیطی تنظیم کنید.
          </div>

          <Link href="/" className="mt-6 inline-block text-[11px] text-ink-muted hover:text-clay">
            ← بازگشت به فروشگاه
          </Link>
        </div>
      </div>
    </div>
  );
}
