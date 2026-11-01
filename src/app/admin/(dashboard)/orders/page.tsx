import Link from "next/link";
import { getAdminOrders } from "@/lib/data";
import { ORDER_STATUS_LABELS, formatNumber, formatToman, toPersianDigits } from "@/lib/format";
import OrderRow from "@/components/admin/order-row";

export const dynamic = "force-dynamic";

const FILTERS = [
  { value: "all", label: "همه" },
  { value: "pending", label: "در انتظار پرداخت" },
  { value: "processing", label: "آماده‌سازی" },
  { value: "shipped", label: "ارسال‌شده" },
  { value: "delivered", label: "تحویل‌شده" },
  { value: "canceled", label: "لغو‌شده" },
];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  let orders: Awaited<ReturnType<typeof getAdminOrders>> = [];
  try {
    orders = await getAdminOrders(status ?? "all");
  } catch {
    orders = [];
  }
  const revenue = orders
    .filter((order) => order.paymentStatus === "paid")
    .reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="eyebrow">فروش</span>
          <h1 className="mt-1.5 text-2xl font-black">مدیریت سفارش‌ها</h1>
          <p className="mt-1 text-[11.5px] text-ink-muted">
            {toPersianDigits(orders.length)} سفارش · درآمد پرداخت‌شده: {formatToman(revenue)}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((filter) => (
            <Link
              key={filter.value}
              href={`/admin/orders${filter.value === "all" ? "" : `?status=${filter.value}`}`}
              className={`rounded-full px-3 py-1.5 text-[10.5px] transition ${
                (status ?? "all") === filter.value
                  ? "bg-ink text-bone"
                  : "border border-line bg-[#fffdf9] text-ink-soft hover:border-ink/25"
              }`}
            >
              {filter.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="card-surface overflow-hidden">
        {orders.length === 0 ? (
          <p className="px-4 py-12 text-center text-[11.5px] text-ink-muted">
            سفارشی با این وضعیت وجود ندارد.
          </p>
        ) : (
          orders.map((order) => <OrderRow key={order.id} order={order} items={order.items} />)
        )}
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        {[
          { label: "جمع سفارش‌های این نما", value: formatNumber(orders.reduce((sum, order) => sum + order.total, 0)) + " تومان" },
          {
            label: "سفارش‌های در انتظار پرداخت",
            value: toPersianDigits(orders.filter((order) => order.paymentStatus === "pending").length),
          },
          {
            label: "تحویل‌شده",
            value: toPersianDigits(orders.filter((order) => order.status === "delivered").length),
          },
        ].map((item) => (
          <div key={item.label} className="card-surface px-4 py-3">
            <p className="text-[10px] text-ink-muted">{item.label}</p>
            <p className="mt-1 text-[13px] font-bold">{item.value}</p>
          </div>
        ))}
      </div>

      <p className="text-[10px] leading-5 text-ink-muted">
        راهنما: وضعیت‌های {Object.values(ORDER_STATUS_LABELS).join("، ")}. پس از تحویل مرسوله
        به پست یا تیپاکس، وضعیت را «ارسال‌شده» و کد رهگیری را ثبت کنید تا در صفحهٔ سفارش
        مشتری نمایش داده شود.
      </p>
    </div>
  );
}
