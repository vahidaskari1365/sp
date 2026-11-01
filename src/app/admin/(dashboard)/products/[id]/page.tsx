import { notFound } from "next/navigation";
import { getCategories, getProductById } from "@/lib/data";
import ProductForm from "@/components/admin/product-form";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = Number(id);
  if (!Number.isInteger(productId)) notFound();

  let product: Awaited<ReturnType<typeof getProductById>> | null = null;
  let categories: Awaited<ReturnType<typeof getCategories>> = [];
  try {
    [product, categories] = await Promise.all([getProductById(productId), getCategories()]);
  } catch {
    product = null;
  }
  if (!product) notFound();

  return (
    <div className="space-y-4">
      <div>
        <span className="eyebrow">ویرایش محصول</span>
        <h1 className="mt-1.5 text-2xl font-black">{product.name}</h1>
        <p className="mt-1 text-[11.5px] text-ink-muted">
          آخرین وضعیت موجودی: {product.totalStock} عدد در {product.variants.length} ترکیب سایز و رنگ.
        </p>
      </div>
      <ProductForm
        product={product}
        categories={categories.map((category) => ({ id: category.id, name: category.name }))}
      />
    </div>
  );
}
