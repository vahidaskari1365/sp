"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "./cart-provider";
import {
  FREE_SHIPPING_THRESHOLD,
  formatNumber,
  formatToman,
  toPersianDigits,
} from "@/lib/format";

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQty, removeItem, subtotal, count } = useCart();
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  return (
    <div
      className={`fixed inset-0 z-[70] ${isOpen ? "" : "pointer-events-none"}`}
      aria-hidden={!isOpen}
    >
      <div
        onClick={closeCart}
        className={`absolute inset-0 bg-ink/50 backdrop-blur-sm transition-opacity duration-500 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />
      <aside
        role="dialog"
        aria-label="سبد خرید"
        className={`absolute inset-y-0 left-0 flex w-full max-w-md flex-col bg-bone shadow-2xl transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <div>
            <p className="text-base font-extrabold">سبد خرید</p>
            <p className="text-xs text-ink-muted">
              {hydratedCount(count)} قلم انتخاب‌شده
            </p>
          </div>
          <button
            type="button"
            onClick={closeCart}
            aria-label="بستن سبد"
            className="grid size-9 place-items-center rounded-full border border-line transition hover:bg-sand"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="border-b border-line bg-bone-deep/60 px-5 py-3">
          <p className="text-[11px] text-ink-soft">
            {remaining > 0 ? (
              <>
                تنها <b className="text-clay">{formatNumber(remaining)} تومان</b> تا ارسال رایگان
              </>
            ) : (
              <>🎉 ارسال سفارش شما رایگان است</>
            )}
          </p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-sand">
            <div
              className="h-full rounded-full bg-clay transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <div className="grid size-20 place-items-center rounded-full border border-dashed border-line">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M6 8h12l-1.2 11H7.2L6 8Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                  <path d="M9.5 8V6.5a2.5 2.5 0 0 1 5 0V8" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </div>
              <p className="text-sm text-ink-muted">سبد خرید شما خالی است.</p>
              <Link href="/products" onClick={closeCart} className="btn btn-clay text-sm">
                شروع خرید
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.variantId} className="flex gap-3">
                  <div className="relative size-24 shrink-0 overflow-hidden rounded-2xl bg-sand">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/products/${item.slug}`}
                        onClick={closeCart}
                        className="text-[13px] font-semibold leading-6 hover:text-clay"
                      >
                        {item.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeItem(item.variantId)}
                        aria-label={`حذف ${item.name}`}
                        className="text-ink-muted transition hover:text-clay"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
                          <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-[11px] text-ink-muted">
                      سایز {item.size} · {item.colorName}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2 rounded-full border border-line px-1">
                        <button
                          type="button"
                          onClick={() => updateQty(item.variantId, item.qty - 1)}
                          className="grid size-7 place-items-center text-ink-soft"
                          aria-label="کاهش تعداد"
                        >
                          −
                        </button>
                        <span className="min-w-4 text-center text-xs font-semibold">
                          {toPersianDigits(item.qty)}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQty(item.variantId, item.qty + 1)}
                          className="grid size-7 place-items-center text-ink-soft disabled:opacity-30"
                          disabled={item.qty >= item.maxStock}
                          aria-label="افزایش تعداد"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-xs font-bold">{formatToman(item.price * item.qty)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-line bg-bone-deep/40 px-5 py-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-ink-muted">جمع سبد</span>
              <span className="font-extrabold">{formatToman(subtotal)}</span>
            </div>
            <Link href="/checkout" onClick={closeCart} className="btn btn-clay mt-3 w-full">
              ادامهٔ خرید و پرداخت
            </Link>
            <Link
              href="/cart"
              onClick={closeCart}
              className="mt-2 block text-center text-xs text-ink-muted underline-offset-4 hover:underline"
            >
              مشاهدهٔ سبد و اعمال کد تخفیف
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}

function hydratedCount(count: number) {
  return toPersianDigits(count);
}
