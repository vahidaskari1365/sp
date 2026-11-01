"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Order, OrderItem } from "@/db/schema";
import {
  ORDER_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
  formatJalaliTime,
  formatToman,
  toPersianDigits,
} from "@/lib/format";

export default function OrderRow({
  order,
  items,
}: {
  order: Order;
  items: OrderItem[];
}) {
  const router = useRouter();
  const [status, setStatus] = useState(order.status);
  const [tracking, setTracking] = useState(order.trackingCode ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save() {
    setSaving(true);
    setSaved(false);
    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: order.id, status, trackingCode: tracking }),
    });
    setSaving(false);
    setSaved(true);
    router.refresh();
  }

  return (
    <div className="border-b border-line px-3 py-3 last:border-b-0">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-[160px]">
          <p className="font-latin text-[11px] font-bold" dir="ltr">
            {order.orderNumber}
          </p>
          <p className="mt-0.5 text-[10px] text-ink-muted">{formatJalaliTime(order.createdAt)}</p>
        </div>
        <div className="min-w-[120px]">
          <p className="text-[11px] font-semibold">{order.customerName}</p>
          <p className="font-latin text-[9.5px] text-ink-muted" dir="ltr">
            {order.phone}
          </p>
        </div>
        <div>
          <p className="text-[11px] font-bold">{formatToman(order.total)}</p>
          <p className={`text-[9.5px] ${order.paymentStatus === "paid" ? "text-olive" : "text-clay"}`}>
            {PAYMENT_STATUS_LABELS[order.paymentStatus]}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="field !w-auto !px-2 !py-1.5 !text-[10.5px]"
            aria-label="وضعیت سفارش"
          >
            {Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <input
            value={tracking}
            onChange={(event) => setTracking(event.target.value)}
            placeholder="کد رهگیری"
            dir="ltr"
            className="field !w-28 !px-2 !py-1.5 !text-[10px]"
            aria-label="کد رهگیری"
          />
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="rounded-lg bg-ink px-2.5 py-1.5 text-[10px] font-semibold text-bone disabled:opacity-60"
          >
            {saving ? "…" : saved ? "ذخیره شد ✓" : "ذخیره"}
          </button>
        </div>
      </div>

      <details className="group mt-2">
        <summary className="cursor-pointer list-none text-[10px] text-clay">
          جزئیات سفارش ({toPersianDigits(items.length)} قلم) ▾
        </summary>
        <div className="mt-2 grid gap-3 rounded-xl bg-bone-deep/40 p-3 sm:grid-cols-2">
          <ul className="space-y-1.5 text-[10.5px]">
            {items.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-2">
                <span className="line-clamp-1">
                  {item.name} · {item.size}/{item.colorName} × {toPersianDigits(item.qty)}
                </span>
                <span className="shrink-0 font-semibold">{formatToman(item.lineTotal)}</span>
              </li>
            ))}
            <li className="mt-1 flex justify-between border-t border-line pt-1 text-ink-muted">
              <span>ارسال ({order.carrier ?? "—"})</span>
              <span>{order.shippingCost === 0 ? "رایگان" : formatToman(order.shippingCost)}</span>
            </li>
            {order.discount > 0 && (
              <li className="flex justify-between text-olive">
                <span>تخفیف {order.couponCode}</span>
                <span>− {formatToman(order.discount)}</span>
              </li>
            )}
          </ul>
          <div className="text-[10.5px] leading-6 text-ink-soft">
            <p>
              <b className="text-ink">گیرنده:</b> {order.customerName}
            </p>
            <p>
              {order.province}، {order.city} — {order.address}
            </p>
            {order.postalCode && <p>کد پستی: {toPersianDigits(order.postalCode)}</p>}
            {order.note && <p className="text-ink-muted">یادداشت: {order.note}</p>}
            <p className="text-ink-muted">پیامک: {order.smsStatus === "failed" ? "ناموفق" : "ارسال شده"}</p>
          </div>
        </div>
      </details>
    </div>
  );
}
