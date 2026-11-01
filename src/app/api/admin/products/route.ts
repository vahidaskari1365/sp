import { db } from "@/db";
import { productImages, products, variants } from "@/db/schema";
import { and, eq, ne } from "drizzle-orm";
import { isAdmin } from "@/lib/auth";
import { slugify } from "@/lib/format";

export const dynamic = "force-dynamic";

type VariantInput = {
  size?: string;
  colorName?: string;
  colorHex?: string;
  stock?: number | string;
};

type ProductInput = {
  id?: number;
  name?: string;
  slug?: string;
  subtitle?: string;
  description?: string;
  story?: string;
  fabric?: string;
  care?: string;
  price?: number | string;
  compareAtPrice?: number | string | null;
  categoryId?: number | string | null;
  badge?: string | null;
  isFeatured?: boolean;
  isActive?: boolean;
  images?: string[];
  variants?: VariantInput[];
};

function normalize(body: ProductInput) {
  const name = String(body.name ?? "").trim();
  const price = Math.max(0, Math.round(Number(body.price) || 0));
  const compareAt = body.compareAtPrice ? Math.max(0, Math.round(Number(body.compareAtPrice))) : null;
  const slugBase = slugify(String(body.slug ?? "").trim() || name) || `product-${Date.now()}`;
  const variantsList = (body.variants ?? [])
    .map((variant) => ({
      size: String(variant.size ?? "").trim(),
      colorName: String(variant.colorName ?? "").trim(),
      colorHex: /^#[0-9a-fA-F]{6}$/.test(String(variant.colorHex ?? ""))
        ? String(variant.colorHex)
        : "#14100c",
      stock: Math.max(0, Math.round(Number(variant.stock) || 0)),
    }))
    .filter((variant) => variant.size && variant.colorName);
  return {
    name,
    slugBase,
    price,
    compareAt,
    variantsList,
    images: (body.images ?? []).map((url) => url.trim()).filter(Boolean).slice(0, 8),
    fields: {
      name,
      subtitle: String(body.subtitle ?? "").trim() || null,
      description: String(body.description ?? "").trim(),
      story: String(body.story ?? "").trim() || null,
      fabric: String(body.fabric ?? "").trim() || null,
      care: String(body.care ?? "").trim() || null,
      price,
      compareAtPrice: compareAt,
      categoryId: body.categoryId ? Number(body.categoryId) : null,
      badge: body.badge ? String(body.badge) : null,
      isFeatured: Boolean(body.isFeatured),
      isActive: body.isActive !== false,
    },
  };
}

async function uniqueSlug(slug: string, ignoreId?: number) {
  let candidate = slug;
  for (let attempt = 0; attempt < 25; attempt += 1) {
    const rows = await db
      .select({ id: products.id })
      .from(products)
      .where(
        ignoreId
          ? and(eq(products.slug, candidate), ne(products.id, ignoreId))
          : eq(products.slug, candidate),
      )
      .limit(1);
    if (rows.length === 0) return candidate;
    candidate = `${slug}-${attempt + 2}`;
  }
  return `${slug}-${Date.now()}`;
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return Response.json({ ok: false }, { status: 401 });
  try {
    const body = (await request.json()) as ProductInput;
    const data = normalize(body);
    if (!data.name || data.price <= 0) {
      return Response.json({ ok: false, message: "نام و قیمت محصول الزامی است." }, { status: 400 });
    }
    const slug = await uniqueSlug(data.slugBase);
    const [product] = await db
      .insert(products)
      .values({ ...data.fields, slug })
      .returning();
    if (data.images.length) {
      await db.insert(productImages).values(
        data.images.map((url, index) => ({
          productId: product.id,
          url,
          alt: `${data.name} — تصویر ${index + 1}`,
          sortOrder: index,
        })),
      );
    }
    if (data.variantsList.length) {
      await db.insert(variants).values(
        data.variantsList.map((variant) => ({
          productId: product.id,
          size: variant.size,
          colorName: variant.colorName,
          colorHex: variant.colorHex,
          stock: variant.stock,
        })),
      );
    }
    return Response.json({ ok: true, id: product.id, slug });
  } catch (error) {
    console.error("admin product create", error);
    return Response.json({ ok: false, message: "ثبت محصول انجام نشد." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!(await isAdmin())) return Response.json({ ok: false }, { status: 401 });
  try {
    const body = (await request.json()) as ProductInput & { quickActive?: boolean };
    const id = Number(body.id);
    if (!id) return Response.json({ ok: false, message: "شناسهٔ محصول لازم است." }, { status: 400 });
    if (body.quickActive) {
      const [updated] = await db
        .update(products)
        .set({ isActive: Boolean(body.isActive) })
        .where(eq(products.id, id))
        .returning({ id: products.id, isActive: products.isActive });
      return Response.json({ ok: true, product: updated });
    }
    const data = normalize(body);
    if (!data.name || data.price <= 0) {
      return Response.json({ ok: false, message: "نام و قیمت محصول الزامی است." }, { status: 400 });
    }
    const slug = await uniqueSlug(data.slugBase, id);
    await db.update(products).set({ ...data.fields, slug }).where(eq(products.id, id));

    if (Array.isArray(body.images)) {
      await db.delete(productImages).where(eq(productImages.productId, id));
      if (data.images.length) {
        await db.insert(productImages).values(
          data.images.map((url, index) => ({
            productId: id,
            url,
            alt: `${data.name} — تصویر ${index + 1}`,
            sortOrder: index,
          })),
        );
      }
    }

    if (Array.isArray(body.variants)) {
      const existing = await db.select().from(variants).where(eq(variants.productId, id));
      const seen = new Set<string>();
      for (const variant of data.variantsList) {
        const key = `${variant.size}::${variant.colorName}`;
        seen.add(key);
        const match = existing.find(
          (row) => row.size === variant.size && row.colorName === variant.colorName,
        );
        if (match) {
          await db
            .update(variants)
            .set({ stock: variant.stock, colorHex: variant.colorHex })
            .where(eq(variants.id, match.id));
        } else {
          await db.insert(variants).values({ productId: id, ...variant });
        }
      }
      for (const row of existing) {
        if (!seen.has(`${row.size}::${row.colorName}`)) {
          await db.delete(variants).where(eq(variants.id, row.id));
        }
      }
    }

    return Response.json({ ok: true, slug });
  } catch (error) {
    console.error("admin product update", error);
    return Response.json({ ok: false, message: "ویرایش محصول انجام نشد." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await isAdmin())) return Response.json({ ok: false }, { status: 401 });
  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("id"));
    if (!id) return Response.json({ ok: false }, { status: 400 });
    await db.delete(products).where(eq(products.id, id));
    return Response.json({ ok: true });
  } catch (error) {
    console.error("admin product delete", error);
    return Response.json({ ok: false, message: "حذف محصول انجام نشد." }, { status: 500 });
  }
}
