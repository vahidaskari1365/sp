"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Coupon } from "@/db/schema";
import { formatJalali, formatToman, toPersianDigits } from "@/lib/format";

export default function CouponManager({ coupons }: { coupons: Coupon[] }) {
  const router = useRouter();
  const [type, setType] = useState("percent");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function create(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setSaving(true);
    setError("");
    setMessage("");
    const response = await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: formData.get("code"),
        type,
        value: formData.get("value"),
        minSubtotal: formData.get("minSubtotal") || 0,
        maxDiscount: formData.get("maxDiscount") || null,
        maxUses: formData.get("maxUses") || 0,
      }),
    });
    const data = (await response.json()) as { ok: boolean; message?: string };
    setSaving(false);
    if (!data.ok) {
      setError(data.message ?? "ثبت کد انجام نشد.");
      return;
    }
    setMessage("کد تخفیف ثبت شد.");
    (event.target as HTMLFormElement).reset();
    router.refresh();
  }

  async function toggle(coupon: Coupon) {
    await fetch("/api/admin/coupons", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: coupon.id, active: !coupon.active }),
    });
    router.refresh();
  }

  async function remove(coupon: Coupon) {
    if (!window.confirm(`کد ${coupon.code} حذف شود؟`)) return;
    await fetch(`/api/admin/coupons?id=${coupon.id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[1.35fr_1fr]">
      <div className="card-surface overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <h2 className="text-[13px] font-extrabold">کدهای فعال</h2>
          <span className="chip !text-[9px]">{toPersianDigits(coupons.length)} کد</span>
        </div>
        <div className="divide-y divide-line">
          {coupons.map((coupon) => (
            <div key={coupon.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
              <div>
                <p className="font-latin text-[12px] font-bold" dir="ltr">
                  {coupon.code}
                </p>
                <p className="mt-0.5 text-[10px] text-ink-muted">
                  {coupon.type === "percent"
                    ? `${toPersianDigits(coupon.value)}٪ تخفیف`
                    : `${formatToman(coupon.value)} تخفیف`}
                  {coupon.minSubtotal > 0 && ` · حداقل خرید ${formatToman(coupon.minSubtotal)}`}
                </p>
                <p className="mt-0.5 text-[9.5px] text-ink-muted">
                  استفاده: {toPersianDigits(coupon.usedCount)}
                  {coupon.maxUses > 0 ? ` از ${toPersianDigits(coupon.maxUses)}` : " (نامحدود)"} ·
                  ثبت {formatJalali(coupon.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => toggle(coupon)}
                  className={`rounded-full px-2.5 py-1 text-[9.5px] font-semibold ${
                    coupon.active ? "bg-olive/10 text-olive" : "bg-sand text-ink-muted"
                  }`}
                >
                  {coupon.active ? "فعال" : "غیرفعال"}
                </button>
                <button
                  type="button"
                  onClick={() => remove(coupon)}
                  className="grid size-7 place-items-center rounded-full border border-line text-[10px] text-clay transition hover:bg-clay hover:text-white"
                  aria-label={`حذف ${coupon.code}`}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
          {coupons.length === 0 && (
            <p className="px-4 py-10 text-center text-[11px] text-ink-muted">کدی ثبت نشده است.</p>
          )}
        </div>
      </div>

      <form onSubmit={create} className="card-surface h-fit p-4">
        <h2 className="text-[13px] font-extrabold">کد تخفیف جدید</h2>
        <div className="mt-3 grid gap-2.5">
          <div>
            <label className="mb-1 block text-[10px] text-ink-soft">کد (انگلیسی)</label>
            <input name="code" required className="field !py-2 !text-[11.5px]" dir="ltr" placeholder="SPRING15" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="mb-1 block text-[10px] text-ink-soft">نوع</label>
              <select value={type} onChange={(event) => setType(event.target.value)} className="field !py-2 !text-[11.5px]">
                <option value="percent">درصدی</option>
                <option value="fixed">مبلغ ثابت</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[10px] text-ink-soft">
                {type === "percent" ? "درصد" : "مبلغ (تومان)"}
              </label>
              <input name="value" type="number" min={1} required className="field !py-2 !text-[11.5px]" dir="ltr" />
            </div>
            <div>
              <label className="mb-1 block text-[10px] text-ink-soft">حداقل خرید</label>
              <input name="minSubtotal" type="number" min={0} className="field !py-2 !text-[11.5px]" dir="ltr" placeholder="0" />
            </div>
            <div>
              <label className="mb-1 block text-[10px] text-ink-soft">سقف تخفیف</label>
              <input name="maxDiscount" type="number" min={0} className="field !py-2 !text-[11.5px]" dir="ltr" placeholder="اختیاری" />
            </div>
            <div className="col-span-2">
              <label className="mb-1 block text-[10px] text-ink-soft">حداکثر تعداد استفاده (۰ = نامحدود)</label>
              <input name="maxUses" type="number" min={0} className="field !py-2 !text-[11.5px]" dir="ltr" placeholder="0" />
            </div>
          </div>
        </div>
        {error && <p className="mt-2 text-[10.5px] text-clay">{error}</p>}
        {message && <p className="mt-2 text-[10.5px] text-olive">{message}</p>}
        <button type="submit" disabled={saving} className="btn btn-clay mt-3 w-full py-2.5 text-[12px] disabled:opacity-60">
          {saving ? "در حال ثبت…" : "ثبت کد تخفیف"}
        </button>
        <p className="mt-2 text-[9.5px] leading-5 text-ink-muted">
          کد فعال در صفحهٔ سبد خرید و پرداخت قابل استفاده است و استفادهٔ هر سفارش به‌صورت
          خودکار شمارش می‌شود.
        </p>
      </form>
    </div>
  );
}
