import { getCategories } from "@/lib/data";
import ProductForm from "@/components/admin/product-form";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  let categories: Awaited<ReturnType<typeof getCategories>> = [];
  try {
    categories = await getCategories();
  } catch {
    categories = [];
  }
  return (
    <div className="space-y-4">
      <div>
        <span className="eyebrow">کاتالوگ</span>
        <h1 className="mt-1.5 text-2xl font-black">افزودن محصول جدید</h1>
        <p className="mt-1 text-[11.5px] text-ink-muted">
          مشخصات، تصاویر و ترکیب‌های سایز/رنگ با موجودی جداگانه را وارد کنید.
        </p>
      </div>
      <ProductForm categories={categories.map((category) => ({ id: category.id, name: category.name }))} />
    </div>
  );
}
