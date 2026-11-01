import type { Metadata } from "next";
import CartView from "@/components/cart-view";

export const metadata: Metadata = {
  title: "سبد خرید",
  description: "بازبینی سبد خرید، اعمال کد تخفیف و ادامهٔ پرداخت در فروشگاه ترمه.",
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return (
    <div className="wrap py-10">
      <div className="mb-6">
        <span className="eyebrow">مرحلهٔ ۱ از ۲</span>
        <h1 className="mt-2 text-[clamp(1.6rem,3.4vw,2.4rem)] font-black">سبد خرید شما</h1>
        <p className="mt-2 text-[12px] text-ink-muted">
          موجودی هر ترکیب سایز و رنگ پیش از پرداخت دوباره کنترل می‌شود.
        </p>
      </div>
      <CartView />
    </div>
  );
}
