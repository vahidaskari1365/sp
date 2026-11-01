import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderByToken } from "@/lib/data";
import {
  ORDER_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
  formatJalaliTime,
  formatToman,
  getShippingMethod,
  toPersianDigits,
} from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "جزئیات سفارش",
  robots: { index: false, follow: false },
};

const STEPS = ["pending", "processing", "shipped", "delivered"];

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ result?: string }>;
}) {
  const { token } = await params;
  const { result } = await searchParams;
  let data = null;
  try {
    data = await getOrderByToken(token);
  } catch {
    data = null;
  }
  if (!data) notFound();

  const { order, items } = data;
  const method = getShippingMethod(order.shippingMethod);
  const activeStep = Math.max(0, STEPS.indexOf(order.status));
  const paid = order.paymentStatus === "paid";

  return (
    <div className="wrap py-10">
      {result === "paid" && paid && (
        <div className="mb-5 flex flex-wrap items-center gap-3 rounded-2xl border border-olive/30 bg-olive/10 px-4 py-3">
          <span className="grid size-9 place-items-center rounded-full bg-olive text-white">✓</span>
          <div>
            <p className="text-[13px] font-bold text-olive">پرداخت با موفقیت انجام شد</p>
            <p className="text-[10.5px] text-ink-soft">
              پیامک تأیید سفارش برای شمارهٔ {order.phone} ارسال شد.
            </p>
          </div>
        </div>
      )}
      {result === "failed" && !paid && (
        <div className="mb-5 rounded-2xl border border-clay/30 bg-clay/10 px-4 py-3 text-[12px] text-clay-dark">
          پرداخت انجام نشد. می‌توانید دوباره از{" "}
          <Link href={`/pay/${order.token}`} className="underline">
            درگاه پرداخت
          </Link>{" "}
          تلاش کنید.
        </div>
      )}

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="eyebrow">سفارش {order.orderNumber}</span>
          <h1 className="mt-2 text-[clamp(1.5rem,3.2vw,2.2rem)] font-black">
            {paid ? "سفارش شما ثبت شد" : "سفارش در انتظار پرداخت"}
          </h1>
          <p className="mt-1.5 text-[11.5px] text-ink-muted">
            ثبت‌شده در {formatJalaliTime(order.createdAt)} · {order.customerName}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`chip ${paid ? "!border-olive/40 !text-olive" : ""}`}>
            {PAYMENT_STATUS_LABELS[order.paymentStatus]}
          </span>
          <span className="chip">{ORDER_STATUS_LABELS[order.status]}</span>
          {!paid && (
            <Link href={`/pay/${order.token}`} className="btn btn-clay px-4 py-2 text-[11.5px]">
              پرداخت سفارش
            </Link>
          )}
        </div>
      </div>

      {/* timeline */}
      <div className="mt-6 grid gap-3 sm:grid-cols-4">
        {[
          { label: "ثبت سفارش", key: "pending" },
          { label: "آماده‌سازی و کنترل کیفیت", key: "processing" },
          { label: `تحویل به ${method.carrier}`, key: "shipped" },
          { label: "تحویل به شما", key: "delivered" },
        ].map((step, index) => {
          const done = paid ? index <= activeStep : index === 0;
          return (
            <div
              key={step.key}
              className={`relative rounded-2xl border px-3.5 py-3 ${
                done ? "border-olive/40 bg-olive/5" : "border-line bg-[#fffdf9]"
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`grid size-6 place-items-center rounded-full text-[10px] font-bold ${
                    done ? "bg-olive text-white" : "bg-sand text-ink-muted"
                  }`}
                >
                  {toPersianDigits(index + 1)}
                </span>
                <p className="text-[11px] font-semibold leading-5">{step.label}</p>
              </div>
              {step.key === "shipped" && order.trackingCode && (
                <p className="mt-2 rounded-lg bg-bone-deep/70 px-2 py-1 text-center font-latin text-[10px] tracking-wider" dir="ltr">
                  {order.trackingCode}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.45fr_1fr]">
        <div className="card-surface p-5">
          <h2 className="text-sm font-extrabold">اقلام سفارش</h2>
          <ul className="mt-3 divide-y divide-line">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-3 py-3">
                <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-sand">
                  {item.image && (
                    <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
                  )}
                </div>
                <div className="flex-1">
                  <Link
                    href={`/products/${item.slug ?? ""}`}
                    className="text-[12px] font-bold hover:text-clay"
                  >
                    {item.name}
                  </Link>
                  <p className="mt-0.5 text-[10.5px] text-ink-muted">
                    سایز {item.size} · {item.colorName} · {toPersianDigits(item.qty)} عدد
                  </p>
                </div>
                <span className="text-[11.5px] font-bold">{formatToman(item.lineTotal)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 space-y-1.5 border-t border-line pt-3 text-[11.5px]">
            <div className="flex justify-between">
              <span className="text-ink-muted">جمع کالاها</span>
              <span>{formatToman(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-olive">
                <span>تخفیف {order.couponCode ? `(${order.couponCode})` : ""}</span>
                <span>− {formatToman(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-ink-muted">ارسال ({method.title})</span>
              <span>{order.shippingCost === 0 ? "رایگان" : formatToman(order.shippingCost)}</span>
            </div>
            <div className="flex items-baseline justify-between border-t border-line pt-2">
              <span className="font-semibold">مبلغ کل</span>
              <span className="text-lg font-black">{formatToman(order.total)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="card-surface p-5 text-[11.5px] leading-6">
            <h2 className="text-sm font-extrabold">اطلاعات ارسال</h2>
            <p className="mt-2 text-ink-soft">
              {order.customerName}
              <br />
              {order.province}، {order.city}
              <br />
              {order.address}
              {order.postalCode ? (
                <>
                  <br />
                  کد پستی: {toPersianDigits(order.postalCode)}
                </>
              ) : null}
            </p>
            <div className="mt-3 border-t border-line pt-3">
              <p className="flex justify-between">
                <span className="text-ink-muted">روش ارسال</span>
                <span className="font-semibold">{method.title} ({method.eta})</span>
              </p>
              <p className="mt-1 flex justify-between">
                <span className="text-ink-muted">شرکت حمل</span>
                <span className="font-semibold">{order.carrier ?? method.carrier}</span>
              </p>
              <p className="mt-1 flex justify-between">
                <span className="text-ink-muted">کد رهگیری</span>
                <span className="font-latin font-semibold" dir="ltr">
                  {order.trackingCode ?? "پس از تحویل به پست"}
                </span>
              </p>
              <p className="mt-1 flex justify-between">
                <span className="text-ink-muted">پیامک اطلاع‌رسانی</span>
                <span className="font-semibold">
                  {order.smsStatus === "failed" ? "ارسال نشد" : "ارسال شد"}
                </span>
              </p>
            </div>
          </div>

          <div className="card-surface p-5">
            <p className="text-[12px] font-bold">پشتیبانی سفارش</p>
            <p className="mt-1 text-[10.5px] leading-6 text-ink-muted">
              برای هر سؤال، شمارهٔ سفارش را به پشتیبانی بدهید: ۰۲۱–۸۸۰۰۰۰۰۰ (۹ تا ۲۱) یا
              پیام در اینستاگرام ترمه.
            </p>
            <Link href="/products" className="btn btn-ghost mt-3 w-full py-2 text-[11.5px]">
              ادامهٔ خرید
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
