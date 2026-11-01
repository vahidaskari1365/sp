import type { MetadataRoute } from "next";
import { getCategories, loadCatalog } from "@/lib/data";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const base = SITE_URL;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "daily", priority: 1 },
    { url: `${base}/products`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/lookbook`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/size-guide`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/faq`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/shipping`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/track`, changeFrequency: "monthly", priority: 0.4 },
  ];

  try {
    const [products, categories] = await Promise.all([loadCatalog(), getCategories()]);
    const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
      url: `${base}/products/${product.slug}`,
      lastModified: product.createdAt,
      changeFrequency: "weekly",
      priority: 0.8,
      images: product.images.slice(0, 2).map((image) => image.url),
    }));
    const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
      url: `${base}/products?category=${category.slug}`,
      changeFrequency: "weekly",
      priority: 0.7,
    }));
    return [...staticRoutes, ...categoryRoutes, ...productRoutes];
  } catch {
    return staticRoutes;
  }
}
