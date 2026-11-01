import type { Metadata } from "next";
import CheckoutForm from "@/components/checkout-form";

export const metadata: Metadata = {
  title: "تکمیل سفارش و پرداخت",
  description: "ثبت اطلاعات گیرنده، انتخاب روش ارسال (پست، تیپاکس، پیک) و پرداخت امن.",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <div className="wrap py-10">
      <div className="mb-6">
        <span className="eyebrow">ثبت سفارش</span>
        <h1 className="mt-2 text-[clamp(1.6rem,3.4vw,2.4rem)] font-black">تکمیل سفارش</h1>
        <p className="mt-2 max-w-lg text-[12px] leading-6 text-ink-muted">
          اطلاعات گیرنده را وارد کنید. پس از تأیید موجودی، به درگاه پرداخت امن منتقل
          می‌شوید و پیامک تأیید همراه کد رهگیری برای شما ارسال می‌شود.
        </p>
      </div>
      <CheckoutForm />
    </div>
  );
}
