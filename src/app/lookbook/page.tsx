import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/reveal";
import { loadCatalog } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "لوک‌بوک بهار ۱۴۰۵ | استایل‌های ترمه",
  description:
    "لوک‌بوک بهار ترمه: ترکیب پالتو پشمی، پیراهن ابریشمی، شلوار کتان و بافت مرینوس در استایل‌های روزمره و رسمی. الهام بگیرید و ست مورد علاقه‌تان را بخرید.",
  alternates: { canonical: "/lookbook" },
};

export default async function LookbookPage() {
  let products: Awaited<ReturnType<typeof loadCatalog>> = [];
  try {
    products = await loadCatalog();
  } catch {
    products = [];
  }

  const looks = [
    {
      title: "صبح شهری",
      text: "ترنچ کتان + شلوار جین راسته + تی‌شرت پنبهٔ ریل",
      slugs: ["termeh-trench-coat", "mahan-straight-jeans", "reel-cotton-tee"],
    },
    {
      title: "شب آرام",
      text: "پیراهن ابریشمی نیلا + شال و کیف دستی",
      slugs: ["nila-silk-dress"],
    },
    {
      title: "روز کاری",
      text: "کت تک‌دکمه سِدرا + شلوار پارچه‌ای نیو",
      slugs: ["sedra-blazer", "nivo-tailored-pants"],
    },
    {
      title: "آخر هفته",
      text: "بافت مرینوس آوا + ست کتان خانگی رُز",
      slugs: ["ava-merino-knit", "rose-linen-set"],
    },
  ];

  return (
    <div>
      <section className="relative overflow-hidden bg-ink py-14 text-bone">
        <div className="pointer-events-none absolute inset-0">
          <Image
            src="https://images.pexels.com/photos/3917692/pexels-photo-3917692.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=900"
            alt="لوک‌بوک ترمه"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/40" />
        </div>
        <div className="wrap relative">
          <Reveal>
            <span className="eyebrow text-gold">لوک‌بوک</span>
            <h1 className="mt-3 max-w-2xl text-[clamp(2rem,5vw,3.6rem)] font-black leading-[1.2]">
              استایل‌هایی برای
              <br />
              زندگی واقعی.
            </h1>
            <p className="mt-4 max-w-lg text-[13px] leading-8 text-bone/70">
              کالکشن بهار ۱۴۰۵ با الهام از نور عصر تهران و بافت پارچه‌های طبیعی عکاسی شده
              است. هر استایل با قطعاتی بسته شده که با هم و جداگانه قابل پوشیدن‌اند.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="wrap section-pad space-y-10">
        {looks.map((look, lookIndex) => {
          const lookProducts = look.slugs
            .map((slug) => products.find((product) => product.slug === slug))
            .filter((product): product is NonNullable<typeof product> => Boolean(product));
          const cover = lookProducts[0]?.images[0]?.url;
          const second = lookProducts[1]?.images[0]?.url ?? lookProducts[0]?.images[1]?.url;

          return (
            <Reveal
              key={look.title}
              delay={lookIndex * 60}
              className="grid items-stretch gap-4 lg:grid-cols-[1.15fr_1fr]"
            >
              <div className="grid grid-cols-2 gap-3">
                {[cover, second]
                  .filter(Boolean)
                  .map((url, index) => (
                    <div
                      key={`${url}-${index}`}
                      className={`relative overflow-hidden bg-sand ${
                        index === 0
                          ? "aspect-[3/4] rounded-t-[180px] rounded-b-[22px]"
                          : "aspect-[3/4] self-end rounded-[22px]"
                      }`}
                    >
                      <Image
                        src={url as string}
                        alt={`${look.title} — تصویر ${index + 1}`}
                        fill
                        sizes="(max-width: 1024px) 45vw, 25vw"
                        className="object-cover transition-transform duration-[1200ms] hover:scale-105"
                      />
                    </div>
                  ))}
              </div>

              <div className="card-surface flex flex-col justify-center p-6">
                <span className="eyebrow">استایل {String(lookIndex + 1).padStart(2, "0")}</span>
                <h2 className="mt-2 text-2xl font-black">{look.title}</h2>
                <p className="mt-2 text-[12px] leading-7 text-ink-muted">{look.text}</p>
                <ul className="mt-4 space-y-1.5">
                  {lookProducts.map((product) => (
                    <li key={product.id} className="flex items-center justify-between gap-2 border-b border-line/70 pb-1.5 text-[11.5px]">
                      <Link href={`/products/${product.slug}`} className="font-semibold hover:text-clay">
                        {product.name}
                      </Link>
                      <span className="text-ink-muted">
                        {new Intl.NumberFormat("fa-IR").format(product.price)} تومان
                      </span>
                    </li>
                  ))}
                </ul>
                <Link href="/products" className="btn btn-clay mt-4 w-fit text-[12.5px]">
                  خرید این استایل
                </Link>
              </div>
            </Reveal>
          );
        })}
      </section>

      <section className="wrap pb-16">
        <Reveal className="grid gap-3 sm:grid-cols-3">
          {products.slice(0, 3).map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group relative aspect-[4/5] overflow-hidden rounded-[24px] bg-sand"
            >
              {product.images[0] && (
                <Image
                  src={product.images[0].url}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 90vw, 30vw"
                  className="object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/75 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="text-[13px] font-bold text-bone">{product.name}</p>
                <p className="mt-0.5 text-[10.5px] text-bone/65">مشاهده در فروشگاه ←</p>
              </div>
            </Link>
          ))}
        </Reveal>
      </section>
    </div>
  );
}
