import type { Metadata } from "next";
import Link from "next/link";
import { SHIPPING_METHODS, formatToman, FREE_SHIPPING_THRESHOLD } from "@/lib/format";

export const metadata: Metadata = {
  title: "شیوه‌های ارسال، هزینه و پیگیری مرسوله",
  description:
    "ارسال ترمه با پست پیشتاز (۲ تا ۴ روز کاری)، تیپاکس (۱ تا ۳ روز) و پیک تهران (همان روز). هزینهٔ ارسال، ارسال رایگان بالای ۲ میلیون تومان و روش دریافت کد رهگیری.",
  alternates: { canonical: "/shipping" },
};

export default function ShippingPage() {
  return (
    <div className="wrap py-12">
      <span className="eyebrow">ارسال و تحویل</span>
      <h1 className="mt-2 text-[clamp(1.8rem,4vw,2.8rem)] font-black">سفارش شما چطور می‌رسد؟</h1>
      <p className="mt-3 max-w-2xl text-[12.5px] leading-8 text-ink-soft">
        سفارش‌ها پس از تأیید پرداخت، طی ۲۴ ساعت کاری بسته‌بندی و تحویل شرکت حمل می‌شوند.
        برای همهٔ مرسوله‌ها کد رهگیری صادر و در صفحهٔ سفارش و پیامک ثبت می‌شود.
      </p>

      <div className="mt-7 grid gap-3 sm:grid-cols-3">
        {SHIPPING_METHODS.map((method) => (
          <div key={method.id} className="card-surface p-5">
            <p className="text-[13px] font-extrabold">{method.title}</p>
            <p className="mt-1.5 text-[11px] leading-6 text-ink-muted">{method.description}</p>
            <p className="mt-3 text-[12px] font-bold text-clay">
              {formatToman(method.cost)}
              <span className="mr-1 text-[10px] font-normal text-ink-muted">— {method.eta}</span>
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-olive/30 bg-olive/5 px-4 py-3 text-[11.5px] leading-6 text-ink-soft">
        سفارش‌های بالای {formatToman(FREE_SHIPPING_THRESHOLD)} ارسال رایگان دارند؛ هزینهٔ
        ارسال در صفحهٔ پرداخت به‌صورت خودکار محاسبه و از مبلغ نهایی کسر یا اضافه می‌شود.
      </div>

      <div id="returns" className="mt-10 grid gap-4 lg:grid-cols-2">
        <section className="card-surface p-5">
          <h2 className="text-[15px] font-extrabold">شرایط مرجوعی و تعویض سایز</h2>
          <ul className="mt-3 space-y-2 text-[11.5px] leading-7 text-ink-soft">
            <li>• تا ۷ روز پس از دریافت کالا، در صورت باز نشدن پلمب و سالم بودن برچسب.</li>
            <li>• اولین تعویض سایز در سراسر ایران رایگان است؛ ارسال مجدد با ترمه.</li>
            <li>• مرجوعی وجه حداکثر تا ۷۲ ساعت کاری به حساب شما بازمی‌گردد.</li>
            <li>• لباس‌های سفارشی‌دوز یا حراج پایانی، امکان مرجوعی ندارند.</li>
          </ul>
          <Link href="/track" className="btn btn-ghost mt-4 w-fit py-2 text-[11.5px]">
            ثبت درخواست مرجوعی
          </Link>
        </section>

        <section className="card-surface p-5">
          <h2 className="text-[15px] font-extrabold">پیگیری مرسوله</h2>
          <p className="mt-2 text-[11.5px] leading-7 text-ink-soft">
            با کد رهگیری ثبت‌شده در صفحهٔ سفارش می‌توانید وضعیت مرسوله را در سامانهٔ پست
            جمهوری اسلامی یا تیپاکس پیگیری کنید. تیم پشتیبانی ترمه هم با شمارهٔ سفارش،
            وضعیت را بررسی می‌کند.
          </p>
          <div className="mt-3 rounded-xl bg-bone-deep/60 px-3 py-2 text-[10.5px] leading-6 text-ink-muted">
            کدهای پست با پیشوند <b className="font-latin">IR</b> و کدهای تیپاکس با پیشوند{" "}
            <b className="font-latin">TX</b> صادر می‌شوند. تماس پشتیبانی: ۰۲۱–۸۸۰۰۰۰۰۰
          </div>
          <Link href="/track" className="btn btn-clay mt-4 w-fit py-2 text-[11.5px]">
            پیگیری سفارش
          </Link>
        </section>
      </div>
    </div>
  );
}
