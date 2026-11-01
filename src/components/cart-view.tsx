"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "./cart-provider";
import {
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_METHODS,
  formatNumber,
  formatToman,
  toPersianDigits,
} from "@/lib/format";

export default function CartView() {
  const { items, updateQty, removeItem, subtotal, clear, hydrated } = useCart();
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const [checking, setChecking] = useState(false);

  async function applyCoupon(event: React.FormEvent) {
    event.preventDefault();
    setChecking(true);
    setMessage(null);
    try {
      const response = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: coupon, subtotal }),
      });
      const data = (await response.json()) as { ok: boolean; discount?: number; message?: string; label?: string };
      if (data.ok) {
        setDiscount(data.discount ?? 0);
        setMessage({ type: "ok", text: `کد «${coupon.toUpperCase()}» اعمال شد — ${data.label}` });
        window.sessionStorage.setItem("termeh_coupon", coupon.toUpperCase());
      } else {
        setDiscount(0);
        setMessage({ type: "error", text: data.message ?? "کد تخفیف معتبر نیست." });
      }
    } catch {
      setMessage({ type: "error", text: "خطا در ارتباط با سرور." });
    } finally {
      setChecking(false);
    }
  }

  if (!hydrated) {
    return (
      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div className="skeleton h-64 rounded-[26px]" />
        <div className="skeleton h-64 rounded-[26px]" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="card-surface flex flex-col items-center gap-4 px-6 py-20 text-center">
        <div className="grid size-20 place-items-center rounded-full border border-dashed border-line text-ink-muted">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M6 8h12l-1.2 11H7.2L6 8Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
            <path d="M9.5 8V6.5a2.5 2.5 0 0 1 5 0V8" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </div>
        <h2 className="text-lg font-extrabold">سبد خرید خالی است</h2>
        <p className="max-w-sm text-[12px] leading-6 text-ink-muted">
          از کالکشن بهار شروع کنید؛ پالتو پشمی، پیراهن ابریشمی و بافت مرینوس منتظر شما هستند.
        </p>
        <Link href="/products" className="btn btn-clay mt-2 text-[13px]">
          دیدن محصولات
        </Link>
      </div>
    );
  }

  const shippingEstimate = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_METHODS[0].cost;
  const total = Math.max(0, subtotal - discount) + shippingEstimate;
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.55fr_1fr]">
      <div>
        <div className="card-surface divide-y divide-line overflow-hidden">
          {items.map((item) => (
            <div key={item.variantId} className="flex gap-3 p-4 sm:gap-4">
              <Link
                href={`/products/${item.slug}`}
                className="relative size-24 shrink-0 overflow-hidden rounded-2xl bg-sand sm:size-28"
              >
                {item.image && (
                  <Image src={item.image} alt={item.name} fill sizes="112px" className="object-cover" />
                )}
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link href={`/products/${item.slug}`} className="text-[13px] font-bold hover:text-clay">
                      {item.name}
                    </Link>
                    <p className="mt-1 text-[11px] text-ink-muted">
                      سایز {item.size} · رنگ {item.colorName}
                    </p>
                    <p className="mt-1 text-[10.5px] text-olive">
                      {item.maxStock <= 3
                        ? `فقط ${toPersianDigits(item.maxStock)} عدد در انبار`
                        : "موجود در انبار"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.variantId)}
                    className="text-[10.5px] text-ink-muted underline-offset-4 hover:text-clay hover:underline"
                  >
                    حذف
                  </button>
                </div>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3">
                  <div className="flex items-center gap-3 rounded-full border border-line bg-[#fffdf9] px-2 py-1">
                    <button
                      type="button"
                      onClick={() => updateQty(item.variantId, item.qty - 1)}
                      className="grid size-6 place-items-center"
                      aria-label="کاهش"
                    >
                      −
                    </button>
                    <span className="min-w-5 text-center text-[12px] font-bold">
                      {toPersianDigits(item.qty)}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQty(item.variantId, item.qty + 1)}
                      disabled={item.qty >= item.maxStock}
                      className="grid size-6 place-items-center disabled:opacity-30"
                      aria-label="افزایش"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-[12.5px] font-extrabold">{formatToman(item.price * item.qty)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <Link href="/products" className="text-[11.5px] text-ink-muted hover:text-clay">
            ← ادامهٔ خرید
          </Link>
          <button
            type="button"
            onClick={clear}
            className="text-[11px] text-ink-muted underline-offset-4 hover:text-clay hover:underline"
          >
            خالی کردن سبد
          </button>
        </div>
      </div>

      <aside className="space-y-3">
        <div className="card-surface p-5">
          <p className="text-sm font-extrabold">خلاصهٔ سفارش</p>
          <div className="mt-3 space-y-2 text-[11.5px]">
            <div className="flex justify-between">
              <span className="text-ink-muted">جمع کالاها</span>
              <span className="font-semibold">{formatToman(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-olive">
                <span>تخفیف</span>
                <span className="font-semibold">− {formatToman(discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-ink-muted">هزینهٔ ارسال (تخمینی)</span>
              <span className="font-semibold">
                {shippingEstimate === 0 ? "رایگان" : formatToman(shippingEstimate)}
              </span>
            </div>
          </div>

          <div className="mt-3 border-t border-line pt-3">
            <form onSubmit={applyCoupon} className="flex gap-2">
              <input
                value={coupon}
                onChange={(event) => setCoupon(event.target.value)}
                placeholder="کد تخفیف (مثلاً TERMEH10)"
                className="field !py-2 !text-[11.5px]"
                aria-label="کد تخفیف"
              />
              <button type="submit" disabled={checking} className="shrink-0 rounded-xl bg-ink px-3 text-[11px] font-semibold text-bone disabled:opacity-60">
                {checking ? "…" : "اعمال"}
              </button>
            </form>
            {message && (
              <p className={`mt-2 text-[10.5px] ${message.type === "ok" ? "text-olive" : "text-clay"}`}>
                {message.text}
              </p>
            )}
          </div>

          <div className="mt-3 flex items-baseline justify-between border-t border-line pt-3">
            <span className="text-[12px] text-ink-muted">مبلغ قابل پرداخت</span>
            <span className="text-lg font-black">{formatToman(total)}</span>
          </div>

          <Link href="/checkout" className="btn btn-clay mt-3 w-full text-[13px]">
            ادامهٔ فرآیند خرید
          </Link>

          {remaining > 0 && (
            <p className="mt-3 rounded-xl bg-bone-deep/70 px-3 py-2 text-[10.5px] leading-5 text-ink-soft">
              {formatNumber(remaining)} تومان تا ارسال رایگان باقی مانده است.
            </p>
          )}
        </div>

        <div className="card-surface p-4 text-[10.5px] leading-6 text-ink-muted">
          <p className="mb-1 text-[11px] font-bold text-ink">پرداخت امن</p>
          درگاه بانکی زرین‌پال / شاپرک · اطلاعات کارت شما ذخیره نمی‌شود · پیامک تأیید سفارش
          پس از پرداخت ارسال می‌شود.
        </div>
      </aside>
    </div>
  );
}
