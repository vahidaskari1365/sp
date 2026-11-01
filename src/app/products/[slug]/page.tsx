import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/product-detail";
import ProductCard from "@/components/product-card";
import Reveal from "@/components/reveal";
import { getCatalog, getProductBySlug } from "@/lib/data";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await getProductBySlug(slug);
    if (!product) return { title: "محصول یافت نشد" };
    const image = product.images[0]?.url;
    return {
      title: `${product.name} | ${product.subtitle ?? "خرید آنلاین"}`,
      description: `${product.subtitle ?? product.name} — ${product.description.slice(0, 140)} خرید با ارسال ۲۴ ساعته، موجودی زندهٔ هر سایز و رنگ و ۷ روز ضمانت بازگشت.`,
      alternates: { canonical: `/products/${product.slug}` },
      openGraph: {
        type: "website",
        title: `${product.name} | ترمه`,
        description: product.subtitle ?? product.description.slice(0, 150),
        images: image ? [{ url: image, alt: product.name }] : undefined,
      },
    };
  } catch {
    return { title: "محصول" };
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  let product: Awaited<ReturnType<typeof getProductBySlug>> | null = null;
  let related: Awaited<ReturnType<typeof getCatalog>> = [];
  try {
    product = await getProductBySlug(slug);
    if (product?.categorySlug) {
      related = (await getCatalog({ category: product.categorySlug }))
        .filter((item) => item.id !== product?.id)
        .slice(0, 4);
    }
  } catch {
    product = null;
  }

  if (!product) notFound();

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((image) => image.url),
    sku: `TRM-${product.id}`,
    brand: { "@type": "Brand", name: "ترمه" },
    material: product.fabric,
    color: product.colors.map((color) => color.name).join("، "),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: (product.rating / 10).toFixed(1),
      reviewCount: product.reviewCount,
      bestRating: "5",
    },
    offers: {
      "@type": "AggregateOffer",
      url: `/products/${product.slug}`,
      priceCurrency: "IRR",
      lowPrice: product.price * 10,
      highPrice: (product.compareAtPrice ?? product.price) * 10,
      offerCount: product.variants.length,
      availability:
        product.totalStock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: "ترمه" },
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "خانه", item: "/" },
      { "@type": "ListItem", position: 2, name: "فروشگاه", item: "/products" },
      ...(product.categorySlug
        ? [
            {
              "@type": "ListItem",
              position: 3,
              name: product.categoryName ?? "",
              item: `/products?category=${product.categorySlug}`,
            },
          ]
        : []),
      {
        "@type": "ListItem",
        position: product.categorySlug ? 4 : 3,
        name: product.name,
        item: `/products/${product.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="wrap pt-6">
        <ProductDetail product={product} />
      </div>

      {related.length > 0 && (
        <section className="section-pad wrap" aria-labelledby="related-title">
          <Reveal className="flex items-end justify-between gap-4">
            <div>
              <span className="eyebrow">پیشنهاد استایلیست</span>
              <h2 id="related-title" className="mt-2 text-[clamp(1.4rem,3vw,2rem)] font-black">
                با این لباس، اینها را بپوشید
              </h2>
            </div>
            <Link href={`/products?category=${product.categorySlug}`} className="link-underline text-[12px] font-semibold text-clay">
              همهٔ {product.categoryName}
            </Link>
          </Reveal>
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} compact />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
