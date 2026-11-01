import type { Metadata } from "next";
import Link from "next/link";
import FilterPanel, { SortSelect } from "@/components/filter-panel";
import ProductCard from "@/components/product-card";
import DbNotice from "@/components/db-notice";
import Reveal from "@/components/reveal";
import { getCatalog, getCategories, loadCatalog } from "@/lib/data";
import { formatNumber, toPersianDigits } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "فروشگاه پوشاک | خرید پالتو، پیراهن، بافت و شلوار",
  description:
    "همهٔ محصولات ترمه در یک صفحه: فیلتر بر اساس دسته، سایز، رنگ و قیمت. پالتو پشمی، پیراهن ابریشمی، بافت مرینوس و شلوار کتان با موجودی زندهٔ هر سایز و رنگ.",
  alternates: { canonical: "/products" },
  openGraph: {
    title: "فروشگاه ترمه — پوشاک معاصر ایرانی",
    description: "فیلتر سایز، رنگ و قیمت روی کالکشن کامل ترمه.",
  },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function toArray(value: string | string[] | undefined) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const category = typeof params.category === "string" ? params.category : undefined;
  const sizes = toArray(params.size);
  const colors = toArray(params.color);
  const toNumber = (value: string | string[] | undefined) => {
    if (typeof value !== "string" || !value.trim()) return undefined;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  };
  const min = toNumber(params.min);
  const max = toNumber(params.max);
  const q = typeof params.q === "string" ? params.q : undefined;
  const sort = typeof params.sort === "string" ? params.sort : "newest";
  const inStockOnly = params.inStock === "1";

  let products: Awaited<ReturnType<typeof getCatalog>> = [];
  let categories: Awaited<ReturnType<typeof getCategories>> = [];
  let all: Awaited<ReturnType<typeof loadCatalog>> = [];
  try {
    [products, categories, all] = await Promise.all([
      getCatalog({ category, sizes, colors, min, max, q, sort, inStockOnly }),
      getCategories(),
      loadCatalog(),
    ]);
  } catch {
    // fall through with empty states
  }

  const allSizes = [...new Set(all.flatMap((product) => product.sizes))].sort((a, b) => {
    const order = ["XS", "S", "M", "L", "XL", "XXL"];
    const ai = order.indexOf(a);
    const bi = order.indexOf(b);
    if (ai !== -1 && bi !== -1) return ai - bi;
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;
    return Number(a) - Number(b);
  });
  const allColors = [
    ...new Map(
      all.flatMap((product) => product.colors.map((color) => [color.name, color])),
    ).values(),
  ];
  const categoryCounts = Object.fromEntries(
    categories.map((cat) => [cat.slug, all.filter((product) => product.categorySlug === cat.slug).length]),
  );
  const activeCategory = categories.find((cat) => cat.slug === category);
  const prices = products.map((product) => product.price);
  const priceRange = prices.length
    ? `${formatNumber(Math.min(...prices))} تا ${formatNumber(Math.max(...prices))} تومان`
    : "";

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-bone-deep to-bone" />

      <div className="wrap relative pt-2">
        <DbNotice dbEmpty={products.length === 0} />
        <nav aria-label="مسیر صفحه" className="flex items-center gap-1.5 text-[11px] text-ink-muted">
          <Link href="/" className="hover:text-clay">
            خانه
          </Link>
          <span>/</span>
          <span className="text-ink">{activeCategory?.name ?? "فروشگاه"}</span>
        </nav>

        <Reveal className="mt-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="eyebrow">کالکشن {toPersianDigits(1405)}</span>
            <h1 className="mt-2 text-[clamp(1.8rem,4vw,2.9rem)] font-black leading-tight">
              {activeCategory?.name ??
                (q ? `نتیجهٔ «${q}»` : "همهٔ محصولات ترمه")}
            </h1>
            <p className="mt-2 max-w-xl text-[12.5px] leading-7 text-ink-muted">
              {activeCategory?.tagline ?? "فیلترها را روی سایز و رنگ خودتان تنظیم کنید؛ موجودی هر ترکیب جداگانه کنترل می‌شود."}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="chip">{toPersianDigits(products.length)} محصول</span>
            {priceRange && <span className="chip">{priceRange}</span>}
            <SortSelect value={sort} />
          </div>
        </Reveal>

        <div className="mt-8 grid gap-6 pb-20 lg:grid-cols-[250px_1fr]">
          <FilterPanel
            categories={categories.map((cat) => ({
              value: cat.slug,
              label: cat.name,
              count: categoryCounts[cat.slug],
            }))}
            sizes={allSizes}
            colors={allColors.map((color) => ({ name: color.name, hex: color.hex }))}
            resultCount={products.length}
          />

          <div>
            {products.length === 0 ? (
              <div className="card-surface flex flex-col items-center justify-center gap-3 px-6 py-20 text-center">
                <div className="grid size-16 place-items-center rounded-full border border-dashed border-line text-ink-muted">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M4 6h16M4 12h10M4 18h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <p className="text-sm font-bold">محصولی با این فیلترها پیدا نشد.</p>
                <p className="max-w-xs text-[11.5px] leading-6 text-ink-muted">
                  فیلترها را پاک کنید یا عبارت جست‌وجو را ساده‌تر بنویسید.
                </p>
                <Link href="/products" className="btn btn-clay mt-2 text-[12.5px]">
                  دیدن همهٔ محصولات
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 xl:grid-cols-4">
                {products.map((product, index) => (
                  <Reveal key={product.id} delay={Math.min(index, 6) * 55}>
                    <ProductCard product={product} priority={index < 4} />
                  </Reveal>
                ))}
              </div>
            )}

            <div className="mt-12 rounded-2xl border border-line bg-bone-deep/40 p-5 text-[11.5px] leading-7 text-ink-soft">
              <b className="text-ink">راهنمای انتخاب سریع:</b> برای پالتو و کت، سایز معمول خود را
              انتخاب کنید؛ برای بافت مرینوس یک سایز کوچک‌تر فرم بدن را بهتر نشان می‌دهد. جدول
              کامل اندازه‌ها در{" "}
              <Link href="/size-guide" className="text-clay underline underline-offset-4">
                راهنمای سایز
              </Link>{" "}
              آمده است. تمام سفارش‌ها امکان تعویض سایز تا ۷ روز دارند.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
