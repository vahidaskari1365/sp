import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import PaymentGateway from "@/components/payment-gateway";
import { getOrderByToken } from "@/lib/data";
import { formatToman } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "درگاه پرداخت",
  robots: { index: false, follow: false },
};

export default async function PayPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  let data = null;
  try {
    data = await getOrderByToken(token);
  } catch {
    data = null;
  }
  if (!data) notFound();
  if (data.order.paymentStatus === "paid") redirect(`/orders/${token}`);
  if (data.order.paymentStatus === "failed") redirect(`/orders/${token}`);

  return (
    <div className="relative min-h-[70vh] py-12">
      <div className="pointer-events-none absolute inset-0 stack-grid opacity-30" />
      <div className="wrap relative">
        <div className="mb-6 text-center">
          <span className="eyebrow justify-center">پرداخت امن</span>
          <h1 className="mt-2 text-[clamp(1.4rem,3vw,2rem)] font-black">
            یک قدم تا رسیدن سفارش
          </h1>
          <p className="mt-2 text-[12px] text-ink-muted">
            مبلغ {formatToman(data.order.total)} برای سفارش {data.order.orderNumber} آمادهٔ پرداخت است.
          </p>
        </div>

        <PaymentGateway
          token={data.order.token}
          amount={data.order.total}
          orderNumber={data.order.orderNumber}
          customerName={data.order.customerName}
        />

        <div className="mt-6 text-center">
          <Link href="/cart" className="text-[11px] text-ink-muted underline-offset-4 hover:underline">
            بازگشت به سبد خرید
          </Link>
        </div>
      </div>
    </div>
  );
}
