"use client";

import Link from "next/link";
import { useState } from "react";
import { formatJalali, toPersianDigits } from "@/lib/format";

const LINKS = [
  {
    title: "فروشگاه",
    items: [
      { label: "همهٔ محصولات", href: "/products" },
      { label: "پالتو و کت", href: "/products?category=outerwear" },
      { label: "پیراهن و شومیز", href: "/products?category=dresses" },
      { label: "بافت و تی‌شرت", href: "/products?category=knitwear" },
      { label: "شلوار و کتان", href: "/products?category=pants" },
    ],
  },
  {
    title: "راهنمای خرید",
    items: [
      { label: "راهنمای سایز", href: "/size-guide" },
      { label: "شیوهٔ ارسال", href: "/shipping" },
      { label: "شرایط مرجوعی", href: "/returns" },
      { label: "سؤال‌های پرتکرار", href: "/faq" },
      { label: "پیگیری سفارش", href: "/track" },
    ],
  },
  {
    title: "ترمه",
    items: [
      { label: "داستان برند", href: "/about" },
      { label: "لوک‌بوک بهار", href: "/lookbook" },
      { label: "پایداری و پارچه", href: "/about#sustainability" },
      { label: "همکاری با ما", href: "/about#careers" },
      { label: "پنل مدیریت", href: "/admin" },
    ],
  },
];

export default function SiteFooter() {
  const [phone, setPhone] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function subscribe(event: React.FormEvent) {
    event.preventDefault();
    setState("loading");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      setState(response.ok ? "done" : "error");
      if (response.ok) setPhone("");
    } catch {
      setState("error");
    }
  }

  return (
    <footer className="relative mt-20 overflow-hidden bg-ink text-bone">
      <div className="pointer-events-none absolute -top-24 right-1/4 size-[420px] rounded-full bg-clay/20 blur-[120px]" />
      <div className="wrap relative">
        <div className="grid gap-10 border-b border-bone/10 py-14 lg:grid-cols-[1.15fr_1.6fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-full bg-bone text-ink">
                <span className="font-latin text-xl leading-none">T</span>
              </span>
              <div>
                <p className="text-2xl font-extrabold">ترمه</p>
                <p className="font-latin text-[10px] tracking-[0.35em] text-bone/50">TERMEH</p>
              </div>
            </div>
            <p className="mt-5 max-w-sm text-[13px] leading-7 text-bone/65">
              ترمه از سال ۱۳۹۷ لباس‌هایی می‌دوزد که سال‌ها همراه شما می‌مانند؛ با پارچهٔ
              طبیعی، الگوی ایرانی و دوخت آتلیه‌ای. هر قطعه در تهران و در تیراژ محدود
              تولید می‌شود.
            </p>

            <form onSubmit={subscribe} className="mt-6 max-w-sm">
              <label htmlFor="newsletter-phone" className="text-[11px] text-bone/60">
                خبرنامهٔ کالکشن‌ها و کد تخفیف ۱۰٪ اولین خرید
              </label>
              <div className="mt-2 flex items-center gap-2 rounded-full border border-bone/20 bg-bone/5 p-1.5">
                <input
                  id="newsletter-phone"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  inputMode="tel"
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  className="w-full bg-transparent px-3 text-sm text-bone outline-none placeholder:text-bone/35"
                  required
                />
                <button
                  type="submit"
                  disabled={state === "loading"}
                  className="btn btn-clay shrink-0 px-4 py-2 text-xs disabled:opacity-60"
                >
                  {state === "loading" ? "…" : "عضویت"}
                </button>
              </div>
              {state === "done" && (
                <p className="mt-2 text-[11px] text-gold">ثبت شد! کد تخفیف برایتان پیامک می‌شود.</p>
              )}
              {state === "error" && (
                <p className="mt-2 text-[11px] text-clay-soft">شماره معتبر نیست، دوباره تلاش کنید.</p>
              )}
            </form>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {LINKS.map((group) => (
              <div key={group.title}>
                <p className="text-[13px] font-bold text-bone">{group.title}</p>
                <ul className="mt-4 space-y-2.5 text-[12px] text-bone/60">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="transition hover:text-gold">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 py-8 md:grid-cols-3 md:items-center">
          <div className="text-[11.5px] leading-6 text-bone/55">
            تهران، خیابان ولیعصر، بالاتر از پارک ساعی، پلاک ۲۱۴
            <br />
            <a href="tel:+982188000000" className="hover:text-gold" dir="ltr">
              ۰۲۱–۸۸۰۰۰۰۰۰
            </a>
            {" · "}
            <a href="mailto:hello@termeh.shop" className="hover:text-gold">
              hello@termeh.shop
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-2 md:justify-center">
            {["زرین‌پال", "شاپرک", "ساماندهی", "اینماد"].map((badge) => (
              <span
                key={badge}
                className="rounded-xl border border-bone/15 bg-bone/5 px-3 py-2 text-[10.5px] text-bone/65"
              >
                {badge}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3 md:justify-end">
            {["اینستاگرام", "تلگرام", "پینترست"].map((social) => (
              <span
                key={social}
                className="grid size-9 place-items-center rounded-full border border-bone/15 text-[9px] text-bone/60"
                title={social}
              >
                {social.slice(0, 2)}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-2 border-t border-bone/10 py-5 text-[10.5px] text-bone/40 sm:flex-row">
          <p suppressHydrationWarning>
            © {toPersianDigits(1404)} ترمه — همهٔ حقوق مادی و معنوی محفوظ است. امروز:{" "}
            {formatJalali(new Date())}
          </p>
          <p>طراحی‌شده برای تجربهٔ خرید آرام؛ ساخته‌شده با Next.js و PostgreSQL</p>
        </div>
      </div>
    </footer>
  );
}
