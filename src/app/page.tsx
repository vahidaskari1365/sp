import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getCategories, getCategoryCounts, getFeaturedProducts } from "@/lib/data";
import ProductRail from "@/components/product-rail";
import DbNotice from "@/components/db-notice";
import Reveal, { Counter } from "@/components/reveal";
import { FAQS, PROCESS_STEPS, TESTIMONIALS } from "@/lib/content";
import { formatNumber, toPersianDigits } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ترمه | پوشاک معاصر ایرانی — کالکشن بهار ۱۴۰۵",
  description:
    "خرید آنلاین پالتو پشمی، پیراهن ابریشمی، بافت مرینوس و شلوار کتان با دوخت آتلیه‌ای. ارسال ۲۴ ساعته، ۷ روز ضمانت بازگشت و پرداخت امن از طریق درگاه بانکی.",
  alternates: { canonical: "/" },
};

const HERO_PRIMARY =
  "https://images.pexels.com/photos/19271547/pexels-photo-19271547.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1100&h=1500";
const HERO_SECONDARY =
  "https://images.pexels.com/photos/20620137/pexels-photo-20620137.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=700&h=900";
const HERO_DETAIL =
  "https://images.pexels.com/photos/5652359/pexels-photo-5652359.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=700&h=900";

const STATS = [
  { value: 12400, suffix: "+", label: "خرید موفق ثبت‌شده" },
  { value: 98, suffix: "٪", label: "رضایت از تناسب سایز" },
  { value: 24, suffix: " ساعت", label: "آماده‌سازی و ارسال" },
  { value: 7, suffix: " روز", label: "ضمانت بازگشت" },
];

const VALUES = [
  { title: "پارچهٔ طبیعی", text: "پشم مرینوس، ابریشم شسته و کتان با گواهی منشأ" },
  { title: "تیراژ محدود", text: "هر طرح حداکثر در ۱۲۰ قطعه تولید می‌شود" },
  { title: "دوخت آتلیه‌ای", text: "کنترل کیفیت چهار مرحله‌ای در تهران" },
  { title: "موجودی واقعی", text: "موجودی جدا برای هر سایز و رنگ، به‌روزرسانی زنده" },
];

const LOOKBOOK = [
  {
    src: "https://images.pexels.com/photos/7760026/pexels-photo-7760026.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=900&h=1200",
    title: "استایل شهر",
    caption: "ترنچ + جین راسته",
    span: "sm:col-span-2 sm:row-span-2",
  },
  {
    src: "https://images.pexels.com/photos/7945666/pexels-photo-7945666.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=700&h=700",
    title: "صبح آرام",
    caption: "پیراهن + شومیز ابریشم",
    span: "",
  },
  {
    src: "https://images.pexels.com/photos/4614216/pexels-photo-4614216.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=700&h=700",
    title: "جزئیات پارچه",
    caption: "کروم‌کورت، مازندران",
    span: "",
  },
  {
    src: "https://images.pexels.com/photos/5119187/pexels-photo-5119187.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=900&h=700",
    title: "کالکشن بهار",
    caption: "کتان گاباردین",
    span: "sm:col-span-2",
  },
];

const EYEBROW = "پوشاک بانوان و آقایان";

export default async function HomePage() {
  let featured = [] as Awaited<ReturnType<typeof getFeaturedProducts>>;
  let categories = [] as Awaited<ReturnType<typeof getCategories>>;
  let counts: Record<string, number> = {};
  try {
    [featured, categories, counts] = await Promise.all([
      getFeaturedProducts(8),
      getCategories(),
      getCategoryCounts(),
    ]);
  } catch {
    // database not ready — render the editorial shell
  }

  const heroImages = [
    featured[0]?.images[0]?.url,
    featured[4]?.images[0]?.url,
    featured[1]?.images[0]?.url,
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.slice(0, 6).map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "کالکشن برگزیدهٔ ترمه",
    itemListElement: featured.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `/products/${product.slug}`,
      name: product.name,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <DbNotice dbEmpty={featured.length === 0} />

      {/* ---------------- HERO ---------------- */}
      <section className="relative overflow-hidden bg-bone">
        <div className="pointer-events-none absolute inset-0 stack-grid opacity-[0.35]" />
        <div className="pointer-events-none absolute -right-40 top-10 size-[520px] rounded-full bg-clay-soft/40 blur-[130px]" />
        <div className="pointer-events-none absolute -left-32 bottom-0 size-[420px] rounded-full bg-sand blur-[110px]" />

        <div className="wrap relative grid items-center gap-10 pb-14 pt-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14 lg:pb-20 lg:pt-16">
          <div className="relative z-10">
            <Reveal className="flex flex-wrap items-center gap-3">
              <span className="eyebrow">{EYEBROW}</span>
              <span className="chip">
                <span className="size-1.5 rounded-full bg-olive" />
                کالکشن بهار {toPersianDigits(1405)}
              </span>
            </Reveal>

            <Reveal delay={80}>
              <h1 className="mt-5 text-[clamp(2.5rem,6.2vw,4.7rem)] font-black leading-[1.14] tracking-tight">
                پوشاکی که
                <br />
                با تو
                <span className="relative mx-3 inline-block">
                  <span className="relative z-10 text-clay">نفس</span>
                  <svg
                    className="absolute -bottom-1 right-0 z-0 w-full text-clay/25"
                    height="14"
                    viewBox="0 0 200 14"
                    preserveAspectRatio="none"
                    aria-hidden
                  >
                    <path
                      d="M2 9C40 3 74 11 110 6s60 2 88-2"
                      stroke="currentColor"
                      strokeWidth="6"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                </span>
                می‌کشد
              </h1>
            </Reveal>

            <Reveal delay={160}>
              <p className="mt-6 max-w-md text-[14.5px] leading-8 text-ink-soft">
                ترمه یک خانهٔ پوشاک معاصر ایرانی است؛ پارچهٔ طبیعی، الگوی آرام و دوخت
                آتلیه‌ای. هر قطعه در تیراژ محدود تولید می‌شود تا سال‌ها همراه شما بماند.
              </p>
            </Reveal>

            <Reveal delay={220} className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/products" className="btn btn-clay shine group">
                خرید کالکشن جدید
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden className="transition-transform duration-300 group-hover:-translate-x-1">
                  <path d="M20 12H4m6-6-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link href="/lookbook" className="btn btn-ghost group">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.4" />
                  <path d="m10 8.5 6 3.5-6 3.5v-7Z" fill="currentColor" />
                </svg>
                دیدن لوک‌بوک
              </Link>
            </Reveal>

            <Reveal delay={300} className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-3">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2 space-x-reverse">
                  {[0, 1, 2].map((index) => (
                    <span
                      key={index}
                      className="grid size-8 place-items-center rounded-full border-2 border-bone bg-sand text-[10px] font-bold text-ink-soft"
                    >
                      {["ن", "س", "آ"][index]}
                    </span>
                  ))}
                </div>
                <p className="text-[11.5px] leading-5 text-ink-muted">
                  <b className="text-ink">۴٫۹ از ۵</b> · بیش از{" "}
                  <b className="text-ink">{formatNumber(2300)}</b> نظر ثبت‌شده
                </p>
              </div>
              <div className="hidden h-8 w-px bg-line sm:block" />
              <div className="flex items-center gap-2 text-[11.5px] text-ink-muted">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden className="text-olive">
                  <path d="M20 7 9.5 17.5 4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                ضمانت اصالت و تعویض سایز
              </div>
            </Reveal>
          </div>

          {/* Hero visual */}
          <div className="relative">
            <Reveal variant="image" className="relative mr-auto w-[86%] overflow-hidden rounded-t-[280px] rounded-b-[28px] bg-sand shadow-[0_40px_90px_-50px_rgba(23,18,12,0.7)]">
              <div className="relative aspect-[4/5.1]">
                <Image
                  src={heroImages[0] ?? HERO_PRIMARY}
                  alt="پالتو پشمی بلند ترمه در نور طبیعی"
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 44vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/35 via-transparent to-transparent" />
              </div>
            </Reveal>

            <div className="absolute -bottom-8 right-2 flex items-end gap-3 sm:right-4">
              <Reveal delay={180} variant="image" className="relative hidden w-32 overflow-hidden rounded-[20px] border-4 border-bone bg-sand shadow-lg sm:block">
                <div className="relative aspect-[3/4]">
                  <Image
                    src={heroImages[1] ?? HERO_SECONDARY}
                    alt="پیراهن ابریشمی ترمه"
                    fill
                    sizes="128px"
                    className="object-cover"
                  />
                </div>
              </Reveal>
              <Reveal delay={280} className="rounded-[20px] border border-line bg-bone/95 px-4 py-3 shadow-xl backdrop-blur">
                <p className="text-[10px] text-ink-muted">پرفروش این هفته</p>
                <p className="mt-0.5 text-[12.5px] font-bold">{featured[0]?.name ?? "پالتو پشمی مِهر"}</p>
                <p className="mt-1 text-[12px] font-extrabold text-clay">
                  {formatNumber(featured[0]?.price ?? 4850000)}{" "}
                  <span className="text-[9.5px] font-normal text-ink-muted">تومان</span>
                </p>
              </Reveal>
            </div>

            <div className="absolute -top-2 left-0 hidden md:block">
              <div className="relative grid size-28 place-items-center rounded-full border border-ink/10 bg-bone/80 backdrop-blur">
                <div className="spin-slow absolute inset-1">
                  <svg viewBox="0 0 100 100" className="size-full">
                    <defs>
                      <path id="arc" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
                    </defs>
                    <text className="fill-ink/60 text-[8.4px] tracking-[0.22em]">
                      <textPath href="#arc">TERMEH · SINCE 1397 · TEHRAN ·</textPath>
                    </text>
                  </svg>
                </div>
                <span className="font-latin text-2xl text-clay">T</span>
              </div>
            </div>

            <div className="absolute right-1/3 top-1/3 float-slow">
              <span className="rounded-full border border-ink/10 bg-bone/90 px-3 py-1.5 text-[10px] font-semibold shadow-sm backdrop-blur">
                ۱۰۰٪ پارچهٔ طبیعی
              </span>
            </div>
          </div>
        </div>

        {/* value marquee */}
        <div className="relative border-y border-line bg-bone-deep/60">
          <div className="flex overflow-hidden py-3">
            <div className="marquee-track marquee-reverse items-center gap-8 whitespace-nowrap px-4 text-[11.5px] text-ink-soft">
              {[...VALUES, ...VALUES, ...VALUES].map((value, index) => (
                <span key={`${value.title}-${index}`} className="flex items-center gap-2">
                  <span className="size-1 rounded-full bg-clay" />
                  <b className="font-semibold text-ink">{value.title}</b>
                  <span className="text-ink-muted">— {value.text}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- CATEGORIES ---------------- */}
      <section className="section-pad wrap" aria-labelledby="categories-title">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="eyebrow">دسته‌بندی‌ها</span>
            <h2 id="categories-title" className="mt-3 text-[clamp(1.7rem,3.4vw,2.6rem)] font-black">
              از کجا شروع کنیم؟
            </h2>
            <p className="mt-2 max-w-md text-[13px] leading-7 text-ink-muted">
              پنج دستهٔ اصلی، با فرم‌های پایه‌ای که با هم ترکیب می‌شوند. روی هر دسته بزنید
              تا فیلتر سایز و رنگ باز شود.
            </p>
          </div>
          <Link href="/products" className="link-underline text-[12.5px] font-semibold text-clay">
            دیدن همهٔ محصولات
          </Link>
        </Reveal>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, index) => (
            <Reveal
              key={category.id}
              delay={index * 70}
              className={index === 0 ? "sm:col-span-2 sm:row-span-2" : ""}
            >
              <Link
                href={`/products?category=${category.slug}`}
                className="group relative block h-full overflow-hidden rounded-[24px] bg-ink"
              >
                <div
                  className={`relative w-full ${
                    index === 0 ? "aspect-[4/3] sm:aspect-[3/4] lg:aspect-[4/4.4]" : "aspect-[16/10]"
                  }`}
                >
                  {category.image && (
                    <Image
                      src={category.image}
                      alt={`دستهٔ ${category.name}`}
                      fill
                      sizes={index === 0 ? "(max-width: 640px) 90vw, 40vw" : "(max-width: 640px) 90vw, 22vw"}
                      className="object-cover opacity-90 transition-all duration-[1200ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-105 group-hover:opacity-100"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/15 to-transparent" />
                </div>
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
                  <div>
                    <p className="text-[15px] font-bold text-bone">{category.name}</p>
                    <p className="mt-0.5 text-[10.5px] text-bone/65">
                      {category.tagline} · {toPersianDigits(counts[category.slug] ?? 0)} محصول
                    </p>
                  </div>
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-bone/95 text-ink transition-all duration-300 group-hover:bg-clay group-hover:text-bone">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path d="M20 12H4m6-6-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- FEATURED RAIL ---------------- */}
      <section className="relative overflow-hidden bg-bone-deep/50 py-16" aria-labelledby="featured-title">
        <div className="wrap flex flex-wrap items-end justify-between gap-4">
          <Reveal>
            <span className="eyebrow">کالکشن برگزیده</span>
            <h2 id="featured-title" className="mt-3 text-[clamp(1.7rem,3.4vw,2.6rem)] font-black">
              انتخاب‌های این فصل
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <Link href="/products" className="link-underline text-[12.5px] font-semibold text-clay">
              دیدن همهٔ {toPersianDigits(featured.length)} انتخاب
            </Link>
          </Reveal>
        </div>

        <ProductRail products={featured} />
      </section>

      {/* ---------------- EDITORIAL / FABRIC ---------------- */}
      <section className="section-pad wrap relative" aria-labelledby="fabric-title">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative order-2 lg:order-1">
            <Reveal variant="image" className="relative aspect-[4/3.4] overflow-hidden rounded-[26px] bg-sand">
              <Image
                src="https://images.pexels.com/photos/4614236/pexels-photo-4614236.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1100&h=900"
                alt="رول‌های پارچه در آتلیهٔ ترمه"
                fill
                sizes="(max-width: 1024px) 90vw, 48vw"
                className="object-cover"
              />
            </Reveal>
            <Reveal
              delay={200}
              className="absolute -bottom-6 -left-2 w-44 overflow-hidden rounded-[20px] border-4 border-bone bg-sand shadow-xl sm:-left-6 sm:w-56"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={HERO_DETAIL}
                  alt="جزئیات دوخت"
                  fill
                  sizes="224px"
                  className="object-cover"
                />
              </div>
            </Reveal>
            <div className="absolute -top-4 right-4 rounded-2xl border border-line bg-bone/95 px-4 py-3 shadow-sm backdrop-blur">
              <p className="font-latin text-2xl text-clay">01</p>
              <p className="text-[10.5px] text-ink-muted">پارچه اول، طراحی بعد</p>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <Reveal>
              <span className="eyebrow">فلسفهٔ ما</span>
              <h2 id="fabric-title" className="mt-3 text-[clamp(1.8rem,3.6vw,2.9rem)] font-black leading-[1.25]">
                پارچه را از مبدأ
                <br />
                انتخاب می‌کنیم، نه از انبار.
              </h2>
              <p className="mt-5 text-[13.5px] leading-8 text-ink-soft">
                هر کالکشن با سفر به کارگاه‌های نساجی شروع می‌شود: از کارگاه پشم مرینوس در
                بیلا تا بافندگی اصفهان. پارچه پیش از طراحی انتخاب می‌شود؛ چون فرم بدون جنس
                معنا ندارد. نتیجه، لباسی است که بعد از سال‌ها هنوز دوستش دارید.
              </p>
            </Reveal>

            <div className="mt-8 grid grid-cols-2 gap-4">
              {[
                { value: 12, label: "کارگاه نساجی همکار" },
                { value: 120, label: "حداکثر تیراژ هر طرح" },
                { value: 4, label: "مرحله کنترل کیفیت" },
                { value: 0, label: "واحد تولید انبوه" },
              ].map((item, index) => (
                <Reveal key={item.label} delay={index * 80} className="rounded-2xl border border-line bg-[#fffdf9] p-4">
                  <p className="text-2xl font-black text-clay">
                    <Counter value={item.value} />
                  </p>
                  <p className="mt-1 text-[11px] text-ink-muted">{item.label}</p>
                </Reveal>
              ))}
            </div>

            <Reveal delay={120} className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/about" className="btn btn-ink text-[13px]">
                داستان ترمه را بخوانید
              </Link>
              <div className="flex flex-wrap gap-2">
                {["پشم مرینوس", "ابریشم شسته", "کتان گاباردین", "پنبهٔ ارگانیک"].map((tag) => (
                  <span key={tag} className="chip">
                    {tag}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- PROCESS ---------------- */}
      <section className="relative overflow-hidden bg-ink py-16 text-bone" aria-labelledby="process-title">
        <div className="pointer-events-none absolute -left-24 top-0 size-[380px] rounded-full bg-clay/25 blur-[110px]" />
        <div className="wrap relative">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <Reveal>
              <span className="eyebrow text-gold">تجربهٔ خرید</span>
              <h2 id="process-title" className="mt-3 text-[clamp(1.8rem,3.4vw,2.7rem)] font-black leading-[1.3]">
                سه قدم تا
                <br />
                لباس بعدی شما.
              </h2>
              <p className="mt-4 max-w-sm text-[12.5px] leading-7 text-bone/60">
                موجودی هر سایز و رنگ جداگانه کنترل می‌شود؛ پس نمی‌توانید چیزی بخرید که
                وجود ندارد.
              </p>
              <Link href="/products" className="btn btn-clay mt-6 text-[13px]">
                شروع کنید
              </Link>
            </Reveal>

            <div className="grid gap-4 sm:grid-cols-3">
              {PROCESS_STEPS.map((step, index) => (
                <Reveal
                  key={step.step}
                  delay={index * 110}
                  className="group relative overflow-hidden rounded-3xl border border-bone/12 bg-bone/[0.04] p-5 backdrop-blur transition hover:border-gold/50 hover:bg-bone/[0.07]"
                >
                  <span className="font-latin text-3xl text-gold/80">{step.step}</span>
                  <h3 className="mt-3 text-sm font-bold">{step.title}</h3>
                  <p className="mt-2 text-[11.5px] leading-6 text-bone/55">{step.text}</p>
                  <div className="mt-4 h-px w-full bg-bone/10">
                    <div className="h-px w-1/3 bg-gold transition-all duration-700 group-hover:w-full" />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- LOOKBOOK BENTO ---------------- */}
      <section className="section-pad wrap" aria-labelledby="lookbook-title">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="eyebrow">لوک‌بوک</span>
            <h2 id="lookbook-title" className="mt-3 text-[clamp(1.7rem,3.4vw,2.6rem)] font-black">
              استایل‌های این بهار
            </h2>
          </div>
          <Link href="/lookbook" className="link-underline text-[12.5px] font-semibold text-clay">
            دیدن همهٔ استایل‌ها
          </Link>
        </Reveal>

        <div className="mt-7 grid auto-rows-[180px] grid-cols-1 gap-4 sm:grid-cols-4 sm:auto-rows-[200px]">
          {LOOKBOOK.map((item, index) => (
            <Reveal
              key={item.title}
              delay={index * 80}
              className={`group relative overflow-hidden rounded-[24px] bg-sand ${item.span}`}
            >
              <Image
                src={item.src}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 92vw, 45vw"
                className="object-cover transition-transform duration-[1300ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/5 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4">
                <div>
                  <p className="text-[13px] font-bold text-bone">{item.title}</p>
                  <p className="text-[10px] text-bone/65">{item.caption}</p>
                </div>
                <span className="grid size-8 place-items-center rounded-full bg-bone/90 text-ink transition group-hover:bg-clay group-hover:text-bone">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- STATS / TRUST ---------------- */}
      <section className="border-y border-line bg-bone-deep/60 py-12" aria-label="اعتماد مشتریان">
        <div className="wrap grid grid-cols-2 gap-6 lg:grid-cols-4">
          {STATS.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 90} className="text-center">
              <p className="text-[clamp(1.7rem,3vw,2.4rem)] font-black text-ink">
                <Counter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-1 text-[11.5px] text-ink-muted">{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- TESTIMONIALS ---------------- */}
      <section className="section-pad wrap" aria-labelledby="testimonials-title">
        <Reveal className="text-center">
          <span className="eyebrow justify-center">تجربهٔ مشتریان</span>
          <h2 id="testimonials-title" className="mt-3 text-[clamp(1.7rem,3.4vw,2.6rem)] font-black">
            از زبان کسانی که پوشیدند
          </h2>
        </Reveal>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((testimonial, index) => (
            <Reveal
              key={testimonial.name}
              delay={index * 80}
              className="card-surface flex flex-col p-5 transition hover:-translate-y-1 hover:shadow-[0_28px_60px_-40px_rgba(23,18,12,0.6)]"
            >
              <div className="flex items-center gap-1 text-gold">
                {Array.from({ length: testimonial.rating }).map((_, starIndex) => (
                  <svg key={starIndex} width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.4l-5.8 3.1 1.1-6.5L2.6 9.4l6.5-.9L12 2.6Z" />
                  </svg>
                ))}
                <span className="mr-1 text-[10px] text-ink-muted">خرید تأییدشده</span>
              </div>
              <p className="mt-3 flex-1 text-[12.5px] leading-7 text-ink-soft">
                «{testimonial.text}»
              </p>
              <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
                <div>
                  <p className="text-[12px] font-bold">{testimonial.name}</p>
                  <p className="text-[10px] text-ink-muted">{testimonial.city}</p>
                </div>
                <span className="chip text-[10px]">{testimonial.product}</span>
              </div>
            </Reveal>
          ))}

          <Reveal className="flex flex-col justify-between rounded-[26px] bg-clay p-6 text-white">
            <div>
              <p className="font-latin text-lg italic opacity-80">Termeh community</p>
              <p className="mt-3 text-xl font-black leading-9">
                به ۱۲٬۴۰۰ نفر بپیوندید که هر فصل با ترمه لباس می‌پوشند.
              </p>
            </div>
            <Link href="/products" className="btn mt-6 bg-bone text-ink hover:bg-white text-[13px]">
              دیدن کالکشن
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ---------------- FAQ (AEO) ---------------- */}
      <section id="faq" className="section-pad bg-bone-deep/40" aria-labelledby="home-faq-title">
        <div className="wrap grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal>
            <span className="eyebrow">پاسخ سریع</span>
            <h2 id="home-faq-title" className="mt-3 text-[clamp(1.7rem,3.4vw,2.5rem)] font-black leading-[1.3]">
              سؤال‌هایی که
              <br />
              بیشتر پرسیده می‌شود
            </h2>
            <p className="mt-4 max-w-sm text-[12.5px] leading-7 text-ink-muted">
              اگر پاسخ خودتان را پیدا نکردید، پشتیبانی ترمه هر روز ۹ تا ۲۱ پاسخ می‌دهد.
            </p>
            <Link href="/faq" className="btn btn-ghost mt-6 text-[13px]">
              همهٔ سؤال‌ها
            </Link>
          </Reveal>

          <div className="divide-y divide-line border-y border-line">
            {FAQS.slice(0, 6).map((faq, index) => (
              <details key={faq.question} className="accordion group py-4" open={index === 0}>
                <summary className="flex items-center justify-between gap-4 text-[13px] font-semibold">
                  <span>{faq.question}</span>
                  <span className="accordion-icon grid size-7 shrink-0 place-items-center rounded-full border border-line text-ink-muted transition-transform duration-300">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-2 pl-10 text-[12px] leading-7 text-ink-muted">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="wrap section-pad">
        <Reveal className="relative overflow-hidden rounded-[32px] bg-ink px-6 py-12 text-center text-bone sm:px-12">
          <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-clay/30 blur-[90px]" />
          <div className="pointer-events-none absolute -bottom-24 left-0 size-72 rounded-full bg-gold/20 blur-[110px]" />
          <div className="relative">
            <p className="font-latin text-[11px] tracking-[0.4em] text-gold">SPRING EDIT 1405</p>
            <h2 className="mx-auto mt-4 max-w-xl text-[clamp(1.6rem,3.4vw,2.5rem)] font-black leading-[1.35]">
              اولین خریدتان ۱۵۰ هزار تومان ارزان‌تر است.
            </h2>
            <p className="mx-auto mt-3 max-w-md text-[12.5px] leading-7 text-bone/65">
              کد <b className="rounded-md bg-bone/10 px-2 py-0.5 font-latin text-gold">WELCOME150</b> را
              در سبد خرید وارد کنید. برای سفارش‌های بالای ۱٫۵ میلیون تومان.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link href="/products" className="btn btn-clay text-[13px]">
                انتخاب لباس
              </Link>
              <Link href="/size-guide" className="btn border border-bone/25 text-bone text-[13px] hover:bg-bone/10">
                راهنمای سایز
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
