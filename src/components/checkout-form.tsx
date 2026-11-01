"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./cart-provider";
import {
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_METHODS,
  formatNumber,
  formatToman,
  toPersianDigits,
} from "@/lib/format";

const PROVINCES = [
  "تهران",
  "البرز",
  "اصفهان",
  "فارس",
  "خراسان رضوی",
  "آذربایجان شرقی",
  "آذربایجان غربی",
  "مازندران",
  "گیلان",
  "خوزستان",
  "کرمان",
  "یزد",
  "قم",
  "کرمانشاه",
  "هرمزگان",
  "سیستان و بلوچستان",
  "گلستان",
  "اردبیل",
  "همدان",
  "لرستان",
  "مرکزی",
  "قزوین",
  "زنجان",
  "بوشهر",
  "کردستان",
  "چهارمحال و بختیاری",
  "سمنان",
  "خراسان شمالی",
  "خراسان جنوبی",
  "ایلام",
  "کهگیلویه و بویراحمد",
];

export default function CheckoutForm() {
  const { items, subtotal, clear, hydrated } = useCart();
  const router = useRouter();
  const [shipping, setShipping] = useState<string>("post");
  const [discount, setDiscount] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [couponInput, setCouponInput] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const stored = window.sessionStorage.getItem("termeh_coupon");
    if (stored) {
      setCouponInput(stored);
      void validateCoupon(stored);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const method = SHIPPING_METHODS.find((item) => item.id === shipping) ?? SHIPPING_METHODS[0];
  const freeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingCost = freeShipping ? 0 : method.cost;
  const total = Math.max(0, subtotal - discount) + shippingCost;

  async function validateCoupon(code: string) {
    if (!code.trim() || subtotal === 0) return;
    try {
      const response = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, subtotal }),
      });
      const data = (await response.json()) as { ok: boolean; discount?: number; message?: string; label?: string };
      if (data.ok) {
        setDiscount(data.discount ?? 0);
        setCouponCode(code.trim().toUpperCase());
        setCouponMessage(`کد اعمال شد — ${data.label}`);
        window.sessionStorage.setItem("termeh_coupon", code.trim().toUpperCase());
      } else {
        setDiscount(0);
        setCouponCode("");
        setCouponMessage(data.message ?? "کد تخفیف معتبر نیست.");
      }
    } catch {
      setCouponMessage("خطا در بررسی کد تخفیف.");
    }
  }

  async function submitOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (items.length === 0) {
      setError("سبد خرید خالی است.");
      return;
    }
    const formData = new FormData(event.currentTarget);
    setSubmitting(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({ variantId: item.variantId, qty: item.qty })),
          customerName: formData.get("customerName"),
          phone: formData.get("phone"),
          email: formData.get("email"),
          province: formData.get("province"),
          city: formData.get("city"),
          address: formData.get("address"),
          postalCode: formData.get("postalCode"),
          note: formData.get("note"),
          shippingMethod: shipping,
          couponCode: couponCode || undefined,
        }),
      });
      const data = (await response.json()) as {
        ok: boolean;
        message?: string;
        issues?: string[];
        paymentUrl?: string;
      };
      if (!data.ok || !data.paymentUrl) {
        setError([data.message ?? "خطا در ثبت سفارش", ...(data.issues ?? [])].join(" — "));
        setSubmitting(false);
        return;
      }
      clear();
      window.sessionStorage.removeItem("termeh_coupon");
      router.push(data.paymentUrl);
    } catch {
      setError("ارتباط با سرور برقرار نشد. اتصال اینترنت را بررسی کنید.");
      setSubmitting(false);
    }
  }

  if (!hydrated) return <div className="skeleton h-96 rounded-[26px]" />;

  if (items.length === 0) {
    return (
      <div className="card-surface px-6 py-16 text-center">
        <p className="text-sm font-bold">سبد خرید شما خالی است.</p>
        <p className="mt-1 text-[12px] text-ink-muted">برای ادامه، ابتدا یک محصول انتخاب کنید.</p>
        <Link href="/products" className="btn btn-clay mt-4 text-[13px]">
          رفتن به فروشگاه
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={submitOrder} className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
      <div className="space-y-4">
        <section className="card-surface p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold">اطلاعات گیرنده</h2>
            <span className="chip text-[10px]">مرحلهٔ ۲ از ۲</span>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="customerName" className="mb-1 block text-[11px] text-ink-soft">
                نام و نام خانوادگی *
              </label>
              <input id="customerName" name="customerName" required minLength={3} className="field" placeholder="مثلاً نگار احمدی" />
            </div>
            <div>
              <label htmlFor="phone" className="mb-1 block text-[11px] text-ink-soft">
                شمارهٔ موبایل * (برای پیامک سفارش)
              </label>
              <input
                id="phone"
                name="phone"
                required
                inputMode="tel"
                pattern="09[0-9]{9}"
                className="field"
                placeholder="09121234567"
                dir="ltr"
              />
            </div>
            <div>
              <label htmlFor="province" className="mb-1 block text-[11px] text-ink-soft">
                استان *
              </label>
              <select id="province" name="province" required className="field" defaultValue="تهران">
                {PROVINCES.map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="city" className="mb-1 block text-[11px] text-ink-soft">
                شهر *
              </label>
              <input id="city" name="city" required className="field" placeholder="تهران" />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="address" className="mb-1 block text-[11px] text-ink-soft">
                نشانی کامل * (خیابان، کوچه، پلاک، واحد)
              </label>
              <textarea id="address" name="address" required minLength={10} rows={2} className="field resize-none" />
            </div>
            <div>
              <label htmlFor="postalCode" className="mb-1 block text-[11px] text-ink-soft">
                کد پستی
              </label>
              <input id="postalCode" name="postalCode" inputMode="numeric" className="field" placeholder="۱۰ رقم" dir="ltr" />
            </div>
            <div>
              <label htmlFor="email" className="mb-1 block text-[11px] text-ink-soft">
                ایمیل (اختیاری)
              </label>
              <input id="email" name="email" type="email" className="field" placeholder="you@example.com" dir="ltr" />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="note" className="mb-1 block text-[11px] text-ink-soft">
                یادداشت سفارش (اختیاری)
              </label>
              <textarea id="note" name="note" rows={2} className="field resize-none" placeholder="ساعت تحویل، سفارش کادو…" />
            </div>
          </div>
        </section>

        <section className="card-surface p-5">
          <h2 className="text-sm font-extrabold">روش ارسال</h2>
          <div className="mt-3 space-y-2">
            {SHIPPING_METHODS.map((option) => {
              const active = shipping === option.id;
              return (
                <label
                  key={option.id}
                  className={`flex cursor-pointer items-center justify-between gap-3 rounded-2xl border px-4 py-3 transition ${
                    active ? "border-clay bg-clay/5" : "border-line hover:border-ink/25"
                  }`}
                >
                  <span className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="shipping"
                      value={option.id}
                      checked={active}
                      onChange={() => setShipping(option.id)}
                      className="mt-1 accent-[#b4552f]"
                    />
                    <span>
                      <span className="block text-[12.5px] font-bold">{option.title}</span>
                      <span className="block text-[10.5px] text-ink-muted">{option.description}</span>
                    </span>
                  </span>
                  <span className="shrink-0 text-[11.5px] font-semibold">
                    {freeShipping ? (
                      <span className="text-olive">رایگان</span>
                    ) : (
                      formatToman(option.cost)
                    )}
                  </span>
                </label>
              );
            })}
          </div>
          <p className="mt-3 rounded-xl bg-bone-deep/60 px-3 py-2 text-[10.5px] leading-5 text-ink-soft">
            کد رهگیری {method.carrier} پس از تحویل مرسوله به شرکت پست، در صفحهٔ سفارش شما
            ثبت و پیامک می‌شود.
          </p>
        </section>
      </div>

      <aside className="space-y-3">
        <div className="card-surface p-5">
          <p className="text-sm font-extrabold">سفارش شما</p>
          <ul className="mt-3 max-h-64 space-y-3 overflow-y-auto pl-1">
            {items.map((item) => (
              <li key={item.variantId} className="flex items-center gap-2.5">
                <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-sand">
                  {item.image && (
                    <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-[11.5px] font-semibold leading-5">{item.name}</p>
                  <p className="text-[10px] text-ink-muted">
                    {item.size} · {item.colorName} × {toPersianDigits(item.qty)}
                  </p>
                </div>
                <span className="text-[11px] font-bold">{formatNumber(item.price * item.qty)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-4 border-t border-line pt-3">
            <div className="flex gap-2">
              <input
                value={couponInput}
                onChange={(event) => setCouponInput(event.target.value)}
                placeholder="کد تخفیف"
                className="field !py-2 !text-[11.5px]"
                aria-label="کد تخفیف"
              />
              <button
                type="button"
                onClick={() => validateCoupon(couponInput)}
                className="shrink-0 rounded-xl bg-ink px-3 text-[11px] font-semibold text-bone"
              >
                اعمال
              </button>
            </div>
            {couponMessage && (
              <p className={`mt-1.5 text-[10.5px] ${discount > 0 ? "text-olive" : "text-clay"}`}>
                {couponMessage}
              </p>
            )}
          </div>

          <div className="mt-3 space-y-1.5 border-t border-line pt-3 text-[11.5px]">
            <div className="flex justify-between">
              <span className="text-ink-muted">جمع کالاها</span>
              <span>{formatToman(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-olive">
                <span>تخفیف</span>
                <span>− {formatToman(discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-ink-muted">ارسال ({method.title})</span>
              <span>{shippingCost === 0 ? "رایگان" : formatToman(shippingCost)}</span>
            </div>
            <div className="flex items-baseline justify-between border-t border-line pt-2">
              <span className="text-[12px] font-semibold">مبلغ قابل پرداخت</span>
              <span className="text-lg font-black">{formatToman(total)}</span>
            </div>
          </div>

          {error && (
            <p className="mt-3 rounded-xl bg-clay/10 px-3 py-2 text-[11px] leading-5 text-clay-dark">
              {error}
            </p>
          )}

          <button type="submit" disabled={submitting} className="btn btn-clay mt-3 w-full text-[13px] disabled:opacity-60">
            {submitting ? "در حال ثبت سفارش…" : "پرداخت و ثبت سفارش"}
          </button>
          <p className="mt-2 text-center text-[10px] leading-5 text-ink-muted">
            با ثبت سفارش،{" "}
            <Link href="/shipping" className="text-clay underline underline-offset-2">
              شرایط ارسال
            </Link>{" "}
            و{" "}
            <Link href="/returns" className="text-clay underline underline-offset-2">
              مرجوعی
            </Link>{" "}
            را می‌پذیرید.
          </p>
        </div>

        <div className="card-surface flex items-center justify-between px-4 py-3 text-[10.5px] text-ink-muted">
          <span>پرداخت امن</span>
          <span className="font-latin tracking-wider">ZARINPAL · SHAPARAK</span>
        </div>
      </aside>
    </form>
  );
}
