"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "./cart-provider";
import { toPersianDigits } from "@/lib/format";

const NAV = [
  { href: "/products", label: "فروشگاه" },
  { href: "/products?category=outerwear", label: "پالتو و کت" },
  { href: "/products?category=dresses", label: "پیراهن و شومیز" },
  { href: "/products?category=knitwear", label: "بافت و تی‌شرت" },
  { href: "/lookbook", label: "لوک‌بوک" },
  { href: "/about", label: "داستان ترمه" },
];

const TICKER = [
  "ارسال رایگان برای سفارش‌های بالای ۲ میلیون تومان",
  "۷ روز ضمانت بازگشت و تعویض سایز",
  "پرداخت امن با درگاه بانکی",
  "دوخت آتلیه‌ای در تهران",
  "کد تخفیف NOWRUZ20 برای کالکشن بهار",
];

export default function SiteHeader() {
  const { count, openCart, hydrated } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [term, setTerm] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  function submitSearch(event: React.FormEvent) {
    event.preventDefault();
    const value = term.trim();
    router.push(value ? `/products?q=${encodeURIComponent(value)}` : "/products");
    setSearchOpen(false);
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-ink text-bone/85">
        <div className="flex h-9 items-center overflow-hidden text-[11px]">
          <div className="marquee-track gap-10 whitespace-nowrap px-4">
            {[...TICKER, ...TICKER].map((item, index) => (
              <span key={`${item}-${index}`} className="flex items-center gap-3">
                <span className="inline-block size-1 rounded-full bg-gold" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div
        className={`border-b transition-all duration-500 ${
          scrolled
            ? "border-line/80 bg-bone/90 shadow-[0_10px_40px_-30px_rgba(23,18,12,0.6)] backdrop-blur-xl"
            : "border-transparent bg-bone"
        }`}
      >
        <div className="wrap flex h-16 items-center justify-between gap-4 md:h-20">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="باز کردن منو"
              className="grid size-10 place-items-center rounded-full border border-line text-ink transition hover:bg-sand lg:hidden"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M3 6h18M3 12h18M3 18h12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
            </button>
            <Link href="/" className="group flex items-center gap-3" aria-label="ترمه، صفحهٔ اصلی">
              <span className="grid size-10 place-items-center rounded-full border border-ink/15 bg-ink text-bone transition group-hover:bg-clay">
                <span className="font-latin text-lg leading-none">T</span>
              </span>
              <span className="flex flex-col leading-none">
                <span className="text-xl font-extrabold tracking-tight">ترمه</span>
                <span className="font-latin text-[10px] tracking-[0.32em] text-ink-muted">
                  TERMEH
                </span>
              </span>
            </Link>
          </div>

          <nav className="hidden items-center gap-7 text-[13px] font-medium text-ink-soft lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="link-underline transition hover:text-clay"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSearchOpen((open) => !open)}
              aria-label="جست‌وجو"
              className="grid size-10 place-items-center rounded-full border border-transparent text-ink transition hover:border-line hover:bg-sand/60"
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
                <path d="m20 20-3.6-3.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
            <Link
              href="/admin"
              aria-label="پنل مدیریت"
              className="hidden size-10 place-items-center rounded-full border border-transparent text-ink transition hover:border-line hover:bg-sand/60 sm:grid"
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.6" />
                <path d="M5 20c1.2-3.6 4-5.2 7-5.2s5.8 1.6 7 5.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </Link>
            <button
              type="button"
              onClick={openCart}
              aria-label="سبد خرید"
              className="relative grid size-10 place-items-center rounded-full bg-ink text-bone transition hover:bg-clay"
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M6 8h12l-1.2 11H7.2L6 8Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                <path d="M9.5 8V6.5a2.5 2.5 0 0 1 5 0V8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              {hydrated && count > 0 && (
                <span className="absolute -top-1 -left-1 grid size-5 place-items-center rounded-full bg-clay text-[10px] font-bold text-white ring-2 ring-bone">
                  {toPersianDigits(count)}
                </span>
              )}
            </button>
          </div>
        </div>

        <div
          className={`overflow-hidden border-line/70 bg-bone transition-all duration-500 ${
            searchOpen ? "max-h-24 border-t" : "max-h-0"
          }`}
        >
          <form onSubmit={submitSearch} className="wrap flex items-center gap-3 py-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden className="text-ink-muted">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
              <path d="m20 20-3.6-3.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <input
              value={term}
              onChange={(event) => setTerm(event.target.value)}
              placeholder="جست‌وجو در کالکشن: پالتو، ابریشم، بافت مرینوس…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-ink-muted"
              aria-label="عبارت جست‌وجو"
            />
            <button type="submit" className="btn btn-clay px-4 py-2 text-xs">
              جست‌وجو
            </button>
          </form>
        </div>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <button
            aria-label="بستن منو"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
          />
          <div className="relative mr-auto flex h-full w-[86%] max-w-sm flex-col bg-bone p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="text-lg font-extrabold">ترمه</span>
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="بستن"
                className="grid size-9 place-items-center rounded-full border border-line"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <nav className="mt-8 flex flex-col">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="border-b border-line/70 py-3.5 text-base font-medium transition hover:text-clay"
                >
                  {item.label}
                </Link>
              ))}
              <Link href="/size-guide" className="border-b border-line/70 py-3.5 text-base">
                راهنمای سایز
              </Link>
              <Link href="/faq" className="border-b border-line/70 py-3.5 text-base">
                سؤال‌های پرتکرار
              </Link>
              <Link href="/admin" className="py-3.5 text-sm text-ink-muted">
                ورود به پنل مدیریت
              </Link>
            </nav>
            <div className="mt-auto rounded-2xl bg-ink p-4 text-bone">
              <p className="text-xs text-bone/70">مشاورهٔ استایل</p>
              <p className="mt-1 text-sm font-semibold">۰۲۱–۸۸۰۰۰۰۰۰</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
