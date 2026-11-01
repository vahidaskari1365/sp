import Link from "next/link";
import {
  getAdminOrders,
  getCatalog,
  getDashboardStats,
} from "@/lib/data";
import {
  ORDER_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
  formatJalaliTime,
  formatNumber,
  formatToman,
  toPersianDigits,
} from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  let stats: Awaited<ReturnType<typeof getDashboardStats>> | null = null;
  let recentOrders: Awaited<ReturnType<typeof getAdminOrders>> = [];
  let catalog: Awaited<ReturnType<typeof getCatalog>> = [];
  try {
    [stats, recentOrders, catalog] = await Promise.all([
      getDashboardStats(),
      getAdminOrders(),
      getCatalog(),
    ]);
  } catch {
    stats = null;
  }

  const revenue = stats?.totals.revenue ?? 0;
  const ordersCount = stats?.totals.orders ?? 0;
  const paidOrders = stats?.totals.paidOrders ?? 0;
  const pending = stats?.totals.pending ?? 0;
  const lowStock = stats?.lowStock ?? [];
  const topProducts = stats?.topProducts ?? [];
  const averageBasket = paidOrders > 0 ? Math.round(revenue / paidOrders) : 0;
  const weekly = recentOrders.slice(0, 5);
  const maxWeekly = Math.max(1, ...weekly.map((order) => order.total));

  const kpis = [
    { label: "درآمد پرداخت‌شده", value: formatToman(revenue), hint: `${toPersianDigits(paidOrders)} سفارش موفق` },
    { label: "کل سفارش‌ها", value: toPersianDigits(ordersCount), hint: "در همهٔ وضعیت‌ها" },
    { label: "در انتظار پرداخت", value: toPersianDigits(pending), hint: "نیازمند پیگیری" },
    { label: "میانگین سبد خرید", value: formatToman(averageBasket), hint: "بر پایهٔ سفارش‌های پرداخت‌شده" },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="eyebrow">داشبورد</span>
          <h1 className="mt-1.5 text-2xl font-black">نمای کلی فروشگاه</h1>
          <p className="mt-1 text-[11.5px] text-ink-muted">
            {formatJalaliTime(new Date())} · تمام اعداد از دیتابیس زنده خوانده می‌شوند.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/products/new" className="btn btn-clay px-4 py-2.5 text-[12px]">
            + محصول جدید
          </Link>
          <Link href="/admin/orders" className="btn btn-ghost px-4 py-2.5 text-[12px]">
            مدیریت سفارش‌ها
          </Link>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="card-surface p-4">
            <p className="text-[10.5px] text-ink-muted">{kpi.label}</p>
            <p className="mt-2 text-xl font-black">{kpi.value}</p>
            <p className="mt-1 text-[10px] text-ink-muted">{kpi.hint}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <div className="card-surface p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[13px] font-extrabold">آخرین سفارش‌ها</h2>
            <Link href="/admin/orders" className="text-[10.5px] text-clay">
              همه →
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="py-8 text-center text-[11.5px] text-ink-muted">هنوز سفارشی ثبت نشده است.</p>
          ) : (
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[520px] text-right text-[11px]">
                <thead className="text-[10px] text-ink-muted">
                  <tr className="border-b border-line">
                    <th className="pb-2 font-medium">شماره</th>
                    <th className="pb-2 font-medium">مشتری</th>
                    <th className="pb-2 font-medium">مبلغ</th>
                    <th className="pb-2 font-medium">پرداخت</th>
                    <th className="pb-2 font-medium">وضعیت</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/70">
                  {recentOrders.slice(0, 6).map((order) => (
                    <tr key={order.id}>
                      <td className="py-2.5">
                        <Link href={`/admin/orders?focus=${order.id}`} className="font-latin text-[10.5px] hover:text-clay" dir="ltr">
                          {order.orderNumber}
                        </Link>
                      </td>
                      <td className="py-2.5">{order.customerName}</td>
                      <td className="py-2.5 font-semibold">{formatNumber(order.total)}</td>
                      <td className="py-2.5">
                        <span className={order.paymentStatus === "paid" ? "text-olive" : "text-clay"}>
                          {PAYMENT_STATUS_LABELS[order.paymentStatus]}
                        </span>
                      </td>
                      <td className="py-2.5">{ORDER_STATUS_LABELS[order.status]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="card-surface p-4">
            <h2 className="text-[13px] font-extrabold">ارزش سفارش‌های اخیر</h2>
            <div className="mt-4 flex h-32 items-end gap-2">
              {weekly.map((order) => (
                <div key={order.id} className="group flex flex-1 flex-col items-center gap-1.5">
                  <span className="text-[9px] text-ink-muted opacity-0 transition group-hover:opacity-100">
                    {formatNumber(order.total)}
                  </span>
                  <div
                    className="w-full rounded-t-lg bg-clay/80 transition hover:bg-clay"
                    style={{ height: `${Math.max(8, (order.total / maxWeekly) * 100)}%` }}
                  />
                  <span className="font-latin text-[8px] text-ink-muted" dir="ltr">
                    {order.orderNumber.split("-").pop()}
                  </span>
                </div>
              ))}
              {weekly.length === 0 && (
                <p className="m-auto text-[11px] text-ink-muted">داده‌ای برای نمایش نیست.</p>
              )}
            </div>
          </div>

          <div className="card-surface p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[13px] font-extrabold">هشدار موجودی</h2>
              <span className="chip text-[9.5px]">{toPersianDigits(lowStock.length)} قلم</span>
            </div>
            <ul className="mt-2 divide-y divide-line/70">
              {lowStock.map((variant) => (
                <li key={variant.id} className="flex items-center justify-between gap-2 py-2 text-[10.5px]">
                  <span className="line-clamp-1">
                    {variant.name} · {variant.size} / {variant.colorName}
                  </span>
                  <Link href={`/admin/products/${variant.productId}`} className="shrink-0">
                    <span className={variant.stock === 0 ? "text-clay" : "text-gold"}>
                      {variant.stock === 0 ? "ناموجود" : `${toPersianDigits(variant.stock)} عدد`}
                    </span>
                  </Link>
                </li>
              ))}
              {lowStock.length === 0 && (
                <li className="py-4 text-center text-[11px] text-ink-muted">موجودی همهٔ اقلام مناسب است.</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1.4fr]">
        <div className="card-surface p-4">
          <h2 className="text-[13px] font-extrabold">پرفروش‌ترین‌ها</h2>
          <ul className="mt-2 space-y-2.5">
            {topProducts.map((product, index) => (
              <li key={product.name} className="flex items-center gap-2.5">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-bone-deep text-[10px] font-bold">
                  {toPersianDigits(index + 1)}
                </span>
                <div className="flex-1">
                  <p className="line-clamp-1 text-[11px] font-semibold">{product.name}</p>
                  <p className="text-[9.5px] text-ink-muted">{toPersianDigits(product.qty)} عدد فروش</p>
                </div>
                <span className="text-[10.5px] font-bold">{formatNumber(product.revenue)}</span>
              </li>
            ))}
            {topProducts.length === 0 && (
              <li className="py-4 text-center text-[11px] text-ink-muted">پس از ثبت سفارش نمایش داده می‌شود.</li>
            )}
          </ul>
        </div>

        <div className="card-surface p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[13px] font-extrabold">محصولات</h2>
            <Link href="/admin/products" className="text-[10.5px] text-clay">
              مدیریت →
            </Link>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {catalog.slice(0, 6).map((product) => (
              <Link
                key={product.id}
                href={`/admin/products/${product.id}`}
                className="rounded-xl border border-line bg-[#fffdf9] p-2.5 transition hover:border-clay/40"
              >
                <p className="line-clamp-1 text-[10.5px] font-semibold">{product.name}</p>
                <p className="mt-1 text-[9.5px] text-ink-muted">
                  {toPersianDigits(product.totalStock)} عدد موجودی
                </p>
                <p className="mt-1 text-[10px] font-bold">{formatNumber(product.price)}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
