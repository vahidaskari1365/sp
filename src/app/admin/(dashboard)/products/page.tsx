import Image from "next/image";
import Link from "next/link";
import { loadCatalog } from "@/lib/data";
import { formatNumber, toPersianDigits } from "@/lib/format";
import ProductRowActions from "@/components/admin/product-row-actions";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  let products: Awaited<ReturnType<typeof loadCatalog>> = [];
  try {
    products = await loadCatalog({ includeInactive: true });
  } catch {
    products = [];
  }

  const totalStock = products.reduce((sum, product) => sum + product.totalStock, 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="eyebrow">کاتالوگ</span>
          <h1 className="mt-1.5 text-2xl font-black">مدیریت محصولات</h1>
          <p className="mt-1 text-[11.5px] text-ink-muted">
            {toPersianDigits(products.length)} محصول · {toPersianDigits(totalStock)} عدد موجودی کل
          </p>
        </div>
        <Link href="/admin/products/new" className="btn btn-clay px-4 py-2.5 text-[12px]">
          + افزودن محصول
        </Link>
      </div>

      <div className="card-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-right text-[11px]">
            <thead className="bg-bone-deep/60 text-[10px] text-ink-muted">
              <tr>
                <th className="px-3 py-2.5 font-medium">محصول</th>
                <th className="px-3 py-2.5 font-medium">دسته</th>
                <th className="px-3 py-2.5 font-medium">قیمت</th>
                <th className="px-3 py-2.5 font-medium">موجودی</th>
                <th className="px-3 py-2.5 font-medium">ترکیب‌ها</th>
                <th className="px-3 py-2.5 font-medium">وضعیت</th>
                <th className="px-3 py-2.5 font-medium">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/70">
              {products.map((product) => (
                <tr key={product.id} className="transition hover:bg-bone-deep/30">
                  <td className="px-3 py-2.5">
                    <Link href={`/admin/products/${product.id}`} className="flex items-center gap-2.5">
                      <span className="relative size-11 shrink-0 overflow-hidden rounded-lg bg-sand">
                        {product.images[0] && (
                          <Image src={product.images[0].url} alt="" fill sizes="44px" className="object-cover" />
                        )}
                      </span>
                      <span>
                        <span className="block text-[11.5px] font-semibold">{product.name}</span>
                        <span className="font-latin block text-[9px] text-ink-muted" dir="ltr">
                          {product.slug}
                        </span>
                      </span>
                    </Link>
                  </td>
                  <td className="px-3 py-2.5 text-ink-muted">{product.categoryName ?? "—"}</td>
                  <td className="px-3 py-2.5 font-semibold">{formatNumber(product.price)}</td>
                  <td className="px-3 py-2.5">
                    <span
                      className={
                        product.totalStock === 0
                          ? "text-clay"
                          : product.totalStock <= 5
                            ? "text-gold"
                            : "text-olive"
                      }
                    >
                      {toPersianDigits(product.totalStock)}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-ink-muted">
                    {toPersianDigits(product.variants.length)}
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={`chip !py-0.5 !text-[9px] ${product.isActive ? "!border-olive/40 !text-olive" : ""}`}>
                      {product.isActive ? "فعال" : "غیرفعال"}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/products/${product.id}`} className="text-[10px] text-clay hover:underline">
                        ویرایش
                      </Link>
                      <ProductRowActions id={product.id} name={product.name} isActive={product.isActive} />
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-3 py-10 text-center text-[11.5px] text-ink-muted">
                    محصولی ثبت نشده است. با دکمهٔ «افزودن محصول» شروع کنید.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
