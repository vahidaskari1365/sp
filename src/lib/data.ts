import { db } from "@/db";
import {
  categories,
  orderItems,
  orders,
  productImages,
  products,
  variants,
} from "@/db/schema";
import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";

export type CatalogImage = { url: string; alt: string | null };
export type CatalogVariant = {
  id: number;
  size: string;
  colorName: string;
  colorHex: string;
  stock: number;
};
export type CatalogProduct = {
  id: number;
  slug: string;
  name: string;
  subtitle: string | null;
  description: string;
  story: string | null;
  fabric: string | null;
  care: string | null;
  price: number;
  compareAtPrice: number | null;
  categoryId: number | null;
  isFeatured: boolean;
  isActive: boolean;
  badge: string | null;
  rating: number;
  reviewCount: number;
  createdAt: Date;
  categoryName: string | null;
  categorySlug: string | null;
  images: CatalogImage[];
  variants: CatalogVariant[];
  totalStock: number;
  colors: { name: string; hex: string; stock: number }[];
  sizes: string[];
};

const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL"];

function sortSizes(sizes: string[]) {
  return [...sizes].sort((a, b) => {
    const ai = SIZE_ORDER.indexOf(a);
    const bi = SIZE_ORDER.indexOf(b);
    if (ai !== -1 && bi !== -1) return ai - bi;
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;
    return Number(a) - Number(b);
  });
}

async function assemble(rows: {
  product: typeof products.$inferSelect;
  categoryName: string | null;
  categorySlug: string | null;
}[]): Promise<CatalogProduct[]> {
  if (rows.length === 0) return [];
  const ids = rows.map((row) => row.product.id);
  const [imageRows, variantRows] = await Promise.all([
    db
      .select()
      .from(productImages)
      .where(inArray(productImages.productId, ids))
      .orderBy(asc(productImages.sortOrder)),
    db
      .select()
      .from(variants)
      .where(inArray(variants.productId, ids))
      .orderBy(asc(variants.id)),
  ]);

  return rows.map(({ product, categoryName, categorySlug }) => {
    const productVariantList = variantRows.filter((v) => v.productId === product.id);
    const colorMap = new Map<string, { name: string; hex: string; stock: number }>();
    for (const variant of productVariantList) {
      const current = colorMap.get(variant.colorName);
      if (current) current.stock += variant.stock;
      else
        colorMap.set(variant.colorName, {
          name: variant.colorName,
          hex: variant.colorHex,
          stock: variant.stock,
        });
    }
    return {
      ...product,
      categoryName,
      categorySlug,
      images: imageRows
        .filter((image) => image.productId === product.id)
        .map((image) => ({ url: image.url, alt: image.alt })),
      variants: productVariantList.map((v) => ({
        id: v.id,
        size: v.size,
        colorName: v.colorName,
        colorHex: v.colorHex,
        stock: v.stock,
      })),
      totalStock: productVariantList.reduce((sum, v) => sum + v.stock, 0),
      colors: [...colorMap.values()],
      sizes: sortSizes([...new Set(productVariantList.map((v) => v.size))]),
    };
  });
}

export async function loadCatalog(options?: { includeInactive?: boolean }) {
  const where = options?.includeInactive ? undefined : eq(products.isActive, true);
  const rows = await db
    .select({
      product: products,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(where)
    .orderBy(desc(products.createdAt), asc(products.id));
  return assemble(rows);
}

export type CatalogFilters = {
  category?: string;
  sizes?: string[];
  colors?: string[];
  min?: number;
  max?: number;
  q?: string;
  sort?: string;
  inStockOnly?: boolean;
};

export async function getCatalog(filters: CatalogFilters = {}) {
  const all = await loadCatalog();
  const query = filters.q?.trim().toLowerCase();

  let result = all.filter((product) => {
    if (filters.category && product.categorySlug !== filters.category) return false;
    if (query) {
      const haystack = `${product.name} ${product.subtitle ?? ""} ${product.description} ${
        product.fabric ?? ""
      } ${product.categoryName ?? ""}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    if (filters.min !== undefined && product.price < filters.min) return false;
    if (filters.max !== undefined && product.price > filters.max) return false;
    if (filters.sizes?.length) {
      if (!filters.sizes.some((size) => product.sizes.includes(size))) return false;
    }
    if (filters.colors?.length) {
      if (!filters.colors.some((color) => product.colors.some((c) => c.name === color)))
        return false;
    }
    if (filters.inStockOnly && product.totalStock === 0) return false;
    return true;
  });

  switch (filters.sort) {
    case "price-asc":
      result = result.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      result = result.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      result = result.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
      break;
    case "newest":
      result = result.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      break;
    default:
      break;
  }
  return result;
}

export async function getProductBySlug(slug: string) {
  const rows = await db
    .select({
      product: products,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.slug, slug))
    .limit(1);
  const [product] = await assemble(rows);
  return product ?? null;
}

export async function getCategories() {
  return db.select().from(categories).orderBy(asc(categories.sortOrder));
}

export async function getCategoryCounts() {
  const rows = await db
    .select({ slug: categories.slug, count: sql<number>`count(${products.id})::int` })
    .from(categories)
    .leftJoin(products, and(eq(products.categoryId, categories.id), eq(products.isActive, true)))
    .groupBy(categories.slug);
  return Object.fromEntries(rows.map((row) => [row.slug, row.count]));
}

export async function getFeaturedProducts(limit = 8) {
  const all = await loadCatalog();
  return all.filter((product) => product.isFeatured).slice(0, limit);
}

export async function getNewArrivals(limit = 4) {
  const all = await loadCatalog();
  return all.slice(0, limit);
}

export async function getProductById(id: number) {
  const rows = await db
    .select({
      product: products,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.id, id))
    .limit(1);
  const [product] = await assemble(rows);
  return product ?? null;
}

export async function getOrderByToken(token: string) {
  const [order] = await db.select().from(orders).where(eq(orders.token, token)).limit(1);
  if (!order) return null;
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
  return { order, items };
}

export async function getAdminOrders(status?: string) {
  const rows = await db
    .select()
    .from(orders)
    .where(status && status !== "all" ? eq(orders.status, status) : undefined)
    .orderBy(desc(orders.createdAt))
    .limit(100);
  const ids = rows.map((row) => row.id);
  const items = ids.length
    ? await db.select().from(orderItems).where(inArray(orderItems.orderId, ids))
    : [];
  return rows.map((order) => ({
    ...order,
    items: items.filter((item) => item.orderId === order.id),
  }));
}

export async function getDashboardStats() {
  const [totals] = await db
    .select({
      orders: sql<number>`count(*)::int`,
      paidOrders: sql<number>`count(*) filter (where ${orders.paymentStatus} = 'paid')::int`,
      revenue: sql<number>`coalesce(sum(${orders.total}) filter (where ${orders.paymentStatus} = 'paid'), 0)::int`,
      pending: sql<number>`count(*) filter (where ${orders.status} = 'pending')::int`,
    })
    .from(orders);

  const lowStock = await db
    .select({
      id: variants.id,
      productId: variants.productId,
      name: products.name,
      size: variants.size,
      colorName: variants.colorName,
      stock: variants.stock,
      slug: products.slug,
    })
    .from(variants)
    .innerJoin(products, eq(variants.productId, products.id))
    .where(sql`${variants.stock} <= 3`)
    .orderBy(asc(variants.stock))
    .limit(8);

  const topProducts = await db
    .select({
      name: orderItems.name,
      image: orderItems.image,
      qty: sql<number>`sum(${orderItems.qty})::int`,
      revenue: sql<number>`sum(${orderItems.lineTotal})::int`,
    })
    .from(orderItems)
    .groupBy(orderItems.name, orderItems.image)
    .orderBy(desc(sql`sum(${orderItems.lineTotal})`))
    .limit(4);

  const recent = await db
    .select()
    .from(orders)
    .orderBy(desc(orders.createdAt))
    .limit(5);

  return {
    totals: totals ?? { orders: 0, paidOrders: 0, revenue: 0, pending: 0 },
    lowStock,
    topProducts,
    recent,
  };
}

export async function getInventory() {
  return db
    .select({
      id: variants.id,
      productId: variants.productId,
      name: products.name,
      size: variants.size,
      colorName: variants.colorName,
      stock: variants.stock,
    })
    .from(variants)
    .innerJoin(products, eq(variants.productId, products.id))
    .orderBy(asc(products.name), asc(variants.size))
    .limit(400);
}
