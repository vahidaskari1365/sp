import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Reveal, { Counter } from "@/components/reveal";

export const metadata: Metadata = {
  title: "داستان ترمه | خانهٔ پوشاک معاصر ایرانی",
  description:
    "ترمه از سال ۱۳۹۷ با هدف ساخت لباس‌های ماندگار آغاز شد: انتخاب پارچه از کارگاه‌های نساجی ایران، طراحی مینیمال و دوخت آتلیه‌ای در تهران. داستان برند، پایداری و همکاری با ما.",
  alternates: { canonical: "/about" },
};

const TIMELINE = [
  {
    year: "۱۳۹۷",
    title: "شروع در یک آتلیهٔ کوچک",
    text: "با ۱۲ متر پارچهٔ کتان و سه چرخ خیاطی در محلهٔ اُرم تهران. اولین کالکشن فقط ۳۰ قطعه بود.",
  },
  {
    year: "۱۳۹۹",
    title: "پارچه از مبدأ",
    text: "همکاری با کارگاه بافت اصفهان و نساجی بیلا برای تأمین پشم مرینوس و ابریشم شسته.",
  },
  {
    year: "۱۴۰۱",
    title: "فروشگاه آنلاین",
    text: "راه‌اندازی فروشگاه اینترنتی با موجودی زندهٔ هر سایز و رنگ و ارسال به سراسر ایران.",
  },
  {
    year: "۱۴۰۴",
    title: "کالکشن کامل",
    text: "امروز ۱۲ کارگاه همکار، ۱۲٬۴۰۰ مشتری و تعهد به تیراژ محدود؛ همان مسیر، بزرگ‌تر.",
  },
];

export default function AboutPage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-bone py-14">
        <div className="pointer-events-none absolute inset-0 stack-grid opacity-40" />
        <div className="wrap relative grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <Reveal>
            <span className="eyebrow">داستان ما</span>
            <h1 className="mt-3 text-[clamp(2rem,4.6vw,3.4rem)] font-black leading-[1.25]">
              لباسی که
              <br />
              با زندگی شما
              <br />
              <span className="text-clay">قد نمی‌کشد.</span>
            </h1>
            <p className="mt-5 max-w-md text-[13px] leading-8 text-ink-soft">
              ترمه یک برند پوشاک ایرانی است که از سال ۱۳۹۷ در تهران شکل گرفت. باور ما ساده
              است: لباس خوب، لباسی است که سال‌ها بپوشید. برای همین از پارچهٔ طبیعی، الگوی
              آرام و دوخت آتلیه‌ای استفاده می‌کنیم و هر طرح را در تیراژ محدود تولید می‌کنیم.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/products" className="btn btn-clay text-[13px]">
                دیدن کالکشن
              </Link>
              <Link href="/lookbook" className="btn btn-ghost text-[13px]">
                لوک‌بوک بهار
              </Link>
            </div>
          </Reveal>
          <Reveal variant="image" className="relative mr-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-t-[240px] rounded-b-[26px] bg-sand">
            <Image
              src="https://images.pexels.com/photos/21855757/pexels-photo-21855757.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1000&h=1300"
              alt="آتلیهٔ دوخت ترمه"
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 40vw"
              className="object-cover"
            />
          </Reveal>
        </div>
      </section>

      <section className="border-y border-line bg-bone-deep/60 py-10">
        <div className="wrap grid grid-cols-2 gap-5 lg:grid-cols-4">
          {[
            { value: 12, suffix: "", label: "کارگاه نساجی همکار" },
            { value: 12400, suffix: "+", label: "مشتری در سراسر ایران" },
            { value: 42, suffix: "", label: "طرح در کالکشن فعلی" },
            { value: 100, suffix: "٪", label: "پارچهٔ طبیعی" },
          ].map((stat) => (
            <Reveal key={stat.label} className="text-center">
              <p className="text-[clamp(1.5rem,3vw,2.2rem)] font-black">
                <Counter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-1 text-[11px] text-ink-muted">{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section-pad wrap">
        <Reveal className="max-w-xl">
          <span className="eyebrow">مسیر ما</span>
          <h2 className="mt-2 text-[clamp(1.6rem,3.4vw,2.5rem)] font-black">هفت سال، چهار ایستگاه</h2>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TIMELINE.map((item, index) => (
            <Reveal key={item.year} delay={index * 90} className="card-surface p-5">
              <p className="text-xl font-black text-clay">{item.year}</p>
              <p className="mt-2 text-[12.5px] font-bold">{item.title}</p>
              <p className="mt-1.5 text-[11px] leading-6 text-ink-muted">{item.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="sustainability" className="section-pad wrap">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <Reveal variant="image" className="relative aspect-[4/3] overflow-hidden rounded-[26px] bg-sand">
            <Image
              src="https://images.pexels.com/photos/4614217/pexels-photo-4614217.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1100&h=850"
              alt="پارچه‌های طبیعی در آتلیه"
              fill
              sizes="(max-width: 1024px) 90vw, 46vw"
              className="object-cover"
            />
          </Reveal>
          <Reveal delay={100}>
            <span className="eyebrow">پایداری</span>
            <h2 className="mt-2 text-[clamp(1.6rem,3.4vw,2.4rem)] font-black leading-[1.3]">
              تولید کم، مصرف هوشمند.
            </h2>
            <p className="mt-4 text-[12.5px] leading-8 text-ink-soft">
              ما به تولید انبوه اعتقادی نداریم. هر طرح حداکثر در ۱۲۰ قطعه تولید می‌شود تا
              پارچهٔ اضافه و لباس فروخته‌نشده باقی نماند. باقی‌ماندهٔ پارچه به کلکسیون
              اکسسوری و کیف تبدیل می‌شود و آب مصرفی رنگ‌رزی در کارگاه‌های همکار بازیافت
              می‌شود.
            </p>
            <ul className="mt-4 grid gap-2 text-[11.5px] text-ink-soft sm:grid-cols-2">
              {[
                "تیراژ محدود هر طرح",
                "بسته‌بندی بدون پلاستیک",
                "تعمیر رایگان دوخت تا یک سال",
                "پارچهٔ گواهی‌دار و قابل ردیابی",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 rounded-xl border border-line bg-[#fffdf9] px-3 py-2">
                  <span className="text-olive">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section id="careers" className="wrap pb-16">
        <Reveal className="relative overflow-hidden rounded-[30px] bg-ink px-6 py-10 text-bone sm:px-10">
          <div className="pointer-events-none absolute -left-16 top-0 size-64 rounded-full bg-clay/25 blur-[100px]" />
          <div className="relative flex flex-wrap items-center justify-between gap-6">
            <div>
              <p className="font-latin text-[10px] tracking-[0.4em] text-gold">WORK WITH US</p>
              <h2 className="mt-2 text-2xl font-black">با ما لباس بسازید</h2>
              <p className="mt-2 max-w-md text-[12px] leading-7 text-bone/65">
                اگر الگوساز، دوخت‌کار یا عکاس مد هستید و به کیفیت اهمیت می‌دهید، نمونه‌کار
                خود را برای ما بفرستید.
              </p>
            </div>
            <a href="mailto:careers@termeh.shop" className="btn btn-clay text-[13px]">
              careers@termeh.shop
            </a>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
