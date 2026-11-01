"use client";

import Link from "next/link";
import { useState } from "react";
import { formatJalali, ORDER_STATUS_LABELS } from "@/lib/format";

type TrackOrder = {
  token: string;
  orderNumber: string;
  status: string;
  createdAt: string;
};

export default function TrackPage() {
  const [query, setQuery] = useState("");
  const [orders, setOrders] = useState<TrackOrder[] | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function search(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setOrders(null);
    try {
      const response = await fetch(`/api/track?q=${encodeURIComponent(query)}`);
      const data = (await response.json()) as {
        ok: boolean;
        message?: string;
        orders?: TrackOrder[];
      };
      if (!data.ok || !data.orders) {
        setError(data.message ?? "سفارش پیدا نشد.");
      } else {
        setOrders(data.orders);
      }
    } catch {
      setError("خطا در ارتباط با سرور.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="wrap max-w-2xl py-12">
      <span className="eyebrow">پیگیری سفارش</span>
      <h1 className="mt-2 text-[clamp(1.6rem,3.4vw,2.3rem)] font-black">سفارش من کجاست؟</h1>
      <p className="mt-2 text-[12px] leading-6 text-ink-muted">
        شمارهٔ سفارش (مثل TRM-1404-1042) یا شمارهٔ موبایلی که با آن خرید کرده‌اید را وارد
        کنید تا وضعیت آماده‌سازی و کد رهگیری پست/تیپاکس را ببینید.
      </p>

      <form onSubmit={search} className="card-surface mt-5 flex flex-col gap-2 p-4 sm:flex-row">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="TRM-1404-1042 یا 09121234567"
          className="field"
          dir="ltr"
          aria-label="شماره سفارش یا موبایل"
          required
        />
        <button type="submit" disabled={loading} className="btn btn-clay shrink-0 px-6 py-2.5 text-[12.5px] disabled:opacity-60">
          {loading ? "در حال جست‌وجو…" : "پیگیری"}
        </button>
      </form>

      {error && <p className="mt-3 rounded-xl bg-clay/10 px-3 py-2 text-[11.5px] text-clay-dark">{error}</p>}

      {orders && (
        <ul className="mt-4 space-y-2">
          {orders.map((order) => (
            <li key={order.token}>
              <Link
                href={`/orders/${order.token}`}
                className="card-surface flex items-center justify-between gap-3 px-4 py-3 transition hover:border-clay/40"
              >
                <div>
                  <p className="font-latin text-[12px] font-bold" dir="ltr">
                    {order.orderNumber}
                  </p>
                  <p className="mt-0.5 text-[10.5px] text-ink-muted">{formatJalali(order.createdAt)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="chip text-[10px]">{ORDER_STATUS_LABELS[order.status] ?? order.status}</span>
                  <span className="text-clay">→</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8 rounded-2xl border border-line bg-bone-deep/40 p-4 text-[11px] leading-6 text-ink-muted">
        سفارش‌های مهمان نیازی به حساب کاربری ندارند؛ لینک اختصاصی سفارش پس از پرداخت
        نمایش داده می‌شود و همان لینک را می‌توانید ذخیره کنید.
      </div>
    </div>
  );
}
