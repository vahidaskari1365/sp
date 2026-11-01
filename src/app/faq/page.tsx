import type { Metadata } from "next";
import Link from "next/link";
import { FAQS } from "@/lib/content";

export const metadata: Metadata = {
  title: "سؤال‌های پرتکرار | ارسال، سایز، پرداخت و مرجوعی",
  description:
    "پاسخ کامل به پرسش‌های رایج خرید از ترمه: انتخاب سایز، موجودی هر سایز و رنگ، هزینه و زمان ارسال با پست و تیپاکس، پرداخت آنلاین، کد تخفیف، مرجوعی و پیگیری سفارش.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="wrap py-12">
        <span className="eyebrow">پشتیبانی</span>
        <h1 className="mt-2 text-[clamp(1.8rem,4vw,2.8rem)] font-black">سؤال‌های پرتکرار</h1>
        <p className="mt-3 max-w-2xl text-[12.5px] leading-8 text-ink-soft">
          همه چیز دربارهٔ خرید، سایز، ارسال و مرجوعی. اگر پاسخ خود را پیدا نکردید، از
          طریق شمارهٔ ۰۲۱–۸۸۰۰۰۰۰۰ یا ایمیل hello@termeh.shop با ما در تماس باشید.
        </p>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          <div className="card-surface divide-y divide-line px-5">
            {FAQS.map((faq, index) => (
              <details key={faq.question} className="accordion py-4" open={index === 0}>
                <summary className="flex items-center justify-between gap-4 text-[13px] font-semibold">
                  <span>{faq.question}</span>
                  <span className="accordion-icon grid size-7 shrink-0 place-items-center rounded-full border border-line text-ink-muted transition-transform duration-300">
                    +
                  </span>
                </summary>
                <p className="mt-2 pl-9 text-[12px] leading-8 text-ink-soft">{faq.answer}</p>
              </details>
            ))}
          </div>

          <aside className="space-y-3">
            <div className="card-surface bg-ink p-5 text-bone">
              <p className="text-[13px] font-bold">مشاورهٔ فوری</p>
              <p className="mt-1 text-[11px] leading-6 text-bone/65">
                هر روز از ۹ تا ۲۱، تیم استایل ترمه پاسخ می‌دهد.
              </p>
              <a href="tel:+982188000000" className="btn btn-clay mt-3 w-full py-2.5 text-[12px]" dir="ltr">
                ۰۲۱–۸۸۰۰۰۰۰۰
              </a>
            </div>
            <div className="card-surface p-4 text-[11px] leading-6">
              <p className="mb-2 font-bold">لینک‌های مرتبط</p>
              <ul className="space-y-1.5 text-ink-soft">
                <li>
                  <Link href="/size-guide" className="hover:text-clay">راهنمای سایز</Link>
                </li>
                <li>
                  <Link href="/shipping" className="hover:text-clay">شیوه‌های ارسال و هزینه</Link>
                </li>
                <li>
                  <Link href="/returns" className="hover:text-clay">شرایط مرجوعی و تعویض</Link>
                </li>
                <li>
                  <Link href="/track" className="hover:text-clay">پیگیری سفارش</Link>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
