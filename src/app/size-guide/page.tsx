import type { Metadata } from "next";
import Link from "next/link";
import { SIZE_TABLE } from "@/lib/content";
import { toPersianDigits } from "@/lib/format";

export const metadata: Metadata = {
  title: "راهنمای سایز | جدول اندازه‌های ترمه",
  description:
    "جدول کامل اندازه‌های ترمه: دور سینه، دور کمر، باسن و قد برای سایزهای XS تا XXL و شلوارهای ۳۰ تا ۳۸. راهنمای اندازه‌گیری و نکات انتخاب سایز پالتو و بافت.",
  alternates: { canonical: "/size-guide" },
};

export default function SizeGuidePage() {
  return (
    <div className="wrap py-12">
      <span className="eyebrow">راهنمای سایز</span>
      <h1 className="mt-2 text-[clamp(1.8rem,4vw,2.8rem)] font-black">اندازهٔ درست، بدون حدس</h1>
      <p className="mt-3 max-w-2xl text-[12.5px] leading-8 text-ink-soft">
        برای انتخاب دقیق، یک متر پارچه‌ای بردارید و اندازه‌های خود را روی یک لباس مشابه
        بگیرید. اگر بین دو سایز هستید، برای پالتو و کت سایز بزرگ‌تر و برای بافت مرینوس سایز
        کوچک‌تر را انتخاب کنید. تعویض سایز تا ۷ روز رایگان است.
      </p>

      <div className="mt-8 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="card-surface overflow-hidden">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <h2 className="text-[13px] font-extrabold">جدول اندازه‌های بانوان و مردان (سانتی‌متر)</h2>
            <span className="chip !text-[9px]">XS تا XXL</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-center text-[11.5px]">
              <thead className="bg-bone-deep/60 text-[10.5px] text-ink-muted">
                <tr>
                  <th className="px-3 py-2.5 font-medium">سایز</th>
                  <th className="px-3 py-2.5 font-medium">دور سینه</th>
                  <th className="px-3 py-2.5 font-medium">دور کمر</th>
                  <th className="px-3 py-2.5 font-medium">دور باسن</th>
                  <th className="px-3 py-2.5 font-medium">قد پیشنهادی</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/70">
                {SIZE_TABLE.map((row) => (
                  <tr key={row.size} className="transition hover:bg-bone-deep/40">
                    <td className="px-3 py-2.5 font-bold">{row.size}</td>
                    <td className="px-3 py-2.5">{row.chest}</td>
                    <td className="px-3 py-2.5">{row.waist}</td>
                    <td className="px-3 py-2.5">{row.hip}</td>
                    <td className="px-3 py-2.5 text-ink-muted">{row.height}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-line px-4 py-3 text-[10.5px] leading-6 text-ink-muted">
            اندازه‌های جدول، اندازهٔ بدن است؛ لباس‌های ترمه بین ۲ تا ۴ سانتی‌متر آزادی
            (ease) دارند. برای شلوارهای جین از سایز کمر استفاده کنید:{" "}
            {["۳۰", "۳۲", "۳۴", "۳۶", "۳۸"].map((size) => toPersianDigits(size)).join("، ")}.
          </div>
        </div>

        <div className="space-y-3">
          <div className="card-surface p-4">
            <h2 className="text-[13px] font-extrabold">چطور اندازه بگیریم؟</h2>
            <ol className="mt-2 space-y-2 text-[11px] leading-6 text-ink-soft">
              <li>
                <b className="text-ink">دور سینه:</b> متر را روی برجسته‌ترین نقطهٔ سینه و
                موازی با زمین نگه دارید.
              </li>
              <li>
                <b className="text-ink">دور کمر:</b> باریک‌ترین نقطهٔ کمر، بدون فشار دادن متر.
              </li>
              <li>
                <b className="text-ink">دور باسن:</b> برجسته‌ترین نقطهٔ باسن، حدود ۲۰ سانتی‌متر
                زیر کمر.
              </li>
              <li>
                <b className="text-ink">قد آستین:</b> از سر شانه تا مچ دست، با دست کمی خمیده.
              </li>
            </ol>
          </div>
          <div className="card-surface bg-clay/5 p-4">
            <p className="text-[12px] font-bold text-clay-dark">مشاورهٔ سایز</p>
            <p className="mt-1 text-[10.5px] leading-6 text-ink-soft">
              اگر هنوز مطمئن نیستید، قد و وزن خود را به شمارهٔ ۰۲۱–۸۸۰۰۰۰۰۰ پیام دهید تا
              تیم استایل ترمه سایز مناسب را پیشنهاد دهد.
            </p>
          </div>
          <Link href="/products" className="btn btn-clay w-full text-[13px]">
            خرید با خیال راحت
          </Link>
        </div>
      </div>
    </div>
  );
}
