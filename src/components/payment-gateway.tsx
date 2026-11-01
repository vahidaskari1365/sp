"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatToman } from "@/lib/format";

export default function PaymentGateway({
  token,
  amount,
  orderNumber,
  customerName,
}: {
  token: string;
  amount: number;
  orderNumber: string;
  customerName: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  async function pay(success: boolean) {
    setStatus("loading");
    setError("");
    try {
      const response = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, success }),
      });
      const data = (await response.json()) as { ok: boolean; redirect?: string; message?: string };
      if (!data.ok || !data.redirect) {
        setError(data.message ?? "پرداخت تأیید نشد.");
        setStatus("error");
        return;
      }
      router.push(data.redirect);
    } catch {
      setError("ارتباط با درگاه برقرار نشد.");
      setStatus("error");
    }
  }

  return (
    <div className="mx-auto w-full max-w-lg">
      <div className="overflow-hidden rounded-[26px] border border-line bg-[#fffdf9] shadow-[0_30px_80px_-50px_rgba(23,18,12,0.6)]">
        <div className="flex items-center justify-between bg-ink px-5 py-4 text-bone">
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-bone text-ink">
              <span className="font-latin text-sm">Z</span>
            </span>
            <div>
              <p className="text-[12px] font-bold">درگاه پرداخت امن</p>
              <p className="text-[9px] text-bone/55">شبیه‌ساز درگاه بانکی — نسخهٔ آزمایشی</p>
            </div>
          </div>
          <span className="rounded-full bg-bone/10 px-2 py-1 text-[9px] text-bone/70">
            SSL / شاپرک
          </span>
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between rounded-xl bg-bone-deep/60 px-3 py-2.5 text-[11px]">
            <span className="text-ink-muted">پذیرنده</span>
            <span className="font-semibold">فروشگاه پوشاک ترمه</span>
          </div>
          <div className="mt-2 flex items-center justify-between rounded-xl bg-bone-deep/60 px-3 py-2.5 text-[11px]">
            <span className="text-ink-muted">شمارهٔ سفارش</span>
            <span className="font-latin font-semibold" dir="ltr">{orderNumber}</span>
          </div>
          <div className="mt-2 flex items-center justify-between rounded-xl bg-bone-deep/60 px-3 py-2.5 text-[11px]">
            <span className="text-ink-muted">نام پرداخت‌کننده</span>
            <span className="font-semibold">{customerName}</span>
          </div>

          <div className="mt-4 rounded-2xl border border-clay/25 bg-clay/5 px-4 py-3 text-center">
            <p className="text-[10.5px] text-ink-muted">مبلغ قابل پرداخت</p>
            <p className="mt-1 text-xl font-black text-clay">{formatToman(amount)}</p>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <label className="mb-1 block text-[10px] text-ink-muted">شمارهٔ کارت</label>
              <input
                dir="ltr"
                disabled
                placeholder="•••• •••• •••• ••••"
                className="field !py-2 text-center text-[11px] opacity-70"
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] text-ink-muted">CVV2 / تاریخ</label>
              <input
                dir="ltr"
                disabled
                placeholder="••• / ••/••"
                className="field !py-2 text-center text-[11px] opacity-70"
              />
            </div>
          </div>
          <p className="mt-2 rounded-lg bg-bone-deep/50 px-3 py-2 text-[9.5px] leading-5 text-ink-muted">
            این صفحه یک شبیه‌ساز درگاه برای محیط نمایشی است؛ هیچ اطلاعات کارتی دریافت یا
            ذخیره نمی‌شود. با تنظیم کلید درگاه واقعی (زرین‌پال) این مرحله به درگاه بانکی
            متصل می‌شود.
          </p>

          {error && (
            <p className="mt-3 rounded-lg bg-clay/10 px-3 py-2 text-[10.5px] text-clay-dark">{error}</p>
          )}

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => pay(true)}
              disabled={status === "loading"}
              className="btn btn-clay w-full py-3 text-[12px] disabled:opacity-60"
            >
              {status === "loading" ? "در حال تأیید…" : "پرداخت موفق"}
            </button>
            <button
              type="button"
              onClick={() => pay(false)}
              disabled={status === "loading"}
              className="btn btn-ghost w-full py-3 text-[12px] disabled:opacity-60"
            >
              انصراف از پرداخت
            </button>
          </div>
        </div>
      </div>
      <p className="mt-3 text-center text-[10px] text-ink-muted">
        در صورت کسر وجه و ناموفق بودن تراکنش، مبلغ حداکثر تا ۷۲ ساعت به حساب شما بازمی‌گردد.
      </p>
    </div>
  );
}
