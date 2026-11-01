"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { CatalogProduct } from "@/lib/data";
import { toPersianDigits } from "@/lib/format";

type VariantRow = {
  id?: number;
  size: string;
  colorName: string;
  colorHex: string;
  stock: number;
};

const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "30", "32", "34", "36", "38"];
const PALETTE = [
  { name: "مشکی", hex: "#14100c" },
  { name: "کرم", hex: "#e6d9c3" },
  { name: "شکلاتی", hex: "#4a3423" },
  { name: "زیتونی", hex: "#5c6149" },
  { name: "سرمه‌ای", hex: "#283a4f" },
  { name: "خاکی", hex: "#a98c6b" },
  { name: "طوسی", hex: "#8b8b85" },
  { name: "صورتی خاکی", hex: "#d8ada1" },
  { name: "سفید", hex: "#f2eee7" },
];

export default function ProductForm({
  categories,
  product,
}: {
  categories: { id: number; name: string }[];
  product?: CatalogProduct | null;
}) {
  const router = useRouter();
  const [variants, setVariants] = useState<VariantRow[]>(
    product?.variants.map((variant) => ({
      id: variant.id,
      size: variant.size,
      colorName: variant.colorName,
      colorHex: variant.colorHex,
      stock: variant.stock,
    })) ?? [{ size: "M", colorName: "مشکی", colorHex: "#14100c", stock: 5 }],
  );
  const [images, setImages] = useState(
    product?.images.map((image) => image.url).join("\n") ?? "",
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  function updateVariant(index: number, patch: Partial<VariantRow>) {
    setVariants((previous) =>
      previous.map((variant, i) => (i === index ? { ...variant, ...patch } : variant)),
    );
  }

  function addVariant(preset?: { colorName: string; colorHex: string }) {
    setVariants((previous) => [
      ...previous,
      {
        size: "M",
        colorName: preset?.colorName ?? "مشکی",
        colorHex: preset?.colorHex ?? "#14100c",
        stock: 5,
      },
    ]);
  }

  function addMatrix() {
    const colors = [...new Map(variants.map((v) => [v.colorName, v.colorHex])).entries()];
    const sizes = [...new Set(variants.map((v) => v.size))];
    const next = [...variants];
    for (const [colorName, colorHex] of colors) {
      for (const size of sizes) {
        if (!next.some((v) => v.colorName === colorName && v.size === size)) {
          next.push({ size, colorName, colorHex, stock: 0 });
        }
      }
    }
    setVariants(next);
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const formData = new FormData(event.currentTarget);
    const payload = {
      id: product?.id,
      name: String(formData.get("name") ?? ""),
      slug: String(formData.get("slug") ?? ""),
      subtitle: String(formData.get("subtitle") ?? ""),
      description: String(formData.get("description") ?? ""),
      story: String(formData.get("story") ?? ""),
      fabric: String(formData.get("fabric") ?? ""),
      care: String(formData.get("care") ?? ""),
      price: Number(formData.get("price")),
      compareAtPrice: formData.get("compareAtPrice") ? Number(formData.get("compareAtPrice")) : null,
      categoryId: formData.get("categoryId") ? Number(formData.get("categoryId")) : null,
      badge: String(formData.get("badge") ?? "") || null,
      isFeatured: formData.get("isFeatured") === "on",
      isActive: formData.get("isActive") === "on",
      images: images.split("\n").map((url) => url.trim()).filter(Boolean),
      variants,
    };

    if (!payload.name.trim() || payload.price <= 0) {
      setError("نام و قیمت محصول را وارد کنید.");
      return;
    }
    if (variants.length === 0) {
      setError("حداقل یک ترکیب سایز و رنگ اضافه کنید.");
      return;
    }
    setSaving(true);
    try {
      const response = await fetch("/api/admin/products", {
        method: product ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as { ok: boolean; message?: string };
      if (!data.ok) {
        setError(data.message ?? "ذخیرهٔ محصول انجام نشد.");
        setSaving(false);
        return;
      }
      router.push("/admin/products");
      router.refresh();
    } catch {
      setError("خطا در ارتباط با سرور.");
      setSaving(false);
    }
  }

  async function removeProduct() {
    if (!product) return;
    if (!window.confirm(`محصول «${product.name}» حذف شود؟ این کار قابل بازگشت نیست.`)) return;
    setDeleting(true);
    await fetch(`/api/admin/products?id=${product.id}`, { method: "DELETE" });
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4">
          <section className="card-surface p-4">
            <h2 className="text-[13px] font-extrabold">اطلاعات اصلی</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-[10.5px] text-ink-soft">نام محصول *</label>
                <input name="name" defaultValue={product?.name} required className="field !py-2.5 !text-[12px]" placeholder="پالتو پشمی مِهر" />
              </div>
              <div>
                <label className="mb-1 block text-[10.5px] text-ink-soft">نامک (slug) — لاتین یا فارسی</label>
                <input name="slug" defaultValue={product?.slug} className="field !py-2.5 !text-[12px]" dir="ltr" placeholder="mehr-wool-coat" />
              </div>
              <div>
                <label className="mb-1 block text-[10.5px] text-ink-soft">زیرعنوان</label>
                <input name="subtitle" defaultValue={product?.subtitle ?? ""} className="field !py-2.5 !text-[12px]" placeholder="پشم مرینوس ایتالیایی" />
              </div>
              <div>
                <label className="mb-1 block text-[10.5px] text-ink-soft">دسته‌بندی</label>
                <select name="categoryId" defaultValue={product?.categoryId ?? ""} className="field !py-2.5 !text-[12px]">
                  <option value="">بدون دسته</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-[10.5px] text-ink-soft">برچسب</label>
                <input name="badge" defaultValue={product?.badge ?? ""} className="field !py-2.5 !text-[12px]" placeholder="جدید، پرفروش…" />
              </div>
              <div>
                <label className="mb-1 block text-[10.5px] text-ink-soft">قیمت (تومان) *</label>
                <input name="price" type="number" min={0} step={1000} defaultValue={product?.price} required className="field !py-2.5 !text-[12px]" dir="ltr" />
              </div>
              <div>
                <label className="mb-1 block text-[10.5px] text-ink-soft">قیمت قبل از تخفیف</label>
                <input name="compareAtPrice" type="number" min={0} step={1000} defaultValue={product?.compareAtPrice ?? ""} className="field !py-2.5 !text-[12px]" dir="ltr" />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-[10.5px] text-ink-soft">توضیحات</label>
                <textarea name="description" defaultValue={product?.description} rows={3} className="field resize-none !text-[12px]" />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-[10.5px] text-ink-soft">داستان / منشأ پارچه</label>
                <textarea name="story" defaultValue={product?.story ?? ""} rows={2} className="field resize-none !text-[12px]" />
              </div>
              <div>
                <label className="mb-1 block text-[10.5px] text-ink-soft">جنس پارچه</label>
                <input name="fabric" defaultValue={product?.fabric ?? ""} className="field !py-2.5 !text-[12px]" />
              </div>
              <div>
                <label className="mb-1 block text-[10.5px] text-ink-soft">روش نگهداری</label>
                <input name="care" defaultValue={product?.care ?? ""} className="field !py-2.5 !text-[12px]" />
              </div>
              <div className="flex items-center gap-4 sm:col-span-2">
                <label className="flex items-center gap-2 text-[11px]">
                  <input type="checkbox" name="isFeatured" defaultChecked={product?.isFeatured ?? true} className="size-4 accent-[#b4552f]" />
                  نمایش در کالکشن برگزیده
                </label>
                <label className="flex items-center gap-2 text-[11px]">
                  <input type="checkbox" name="isActive" defaultChecked={product?.isActive ?? true} className="size-4 accent-[#b4552f]" />
                  فعال در فروشگاه
                </label>
              </div>
            </div>
          </section>

          <section className="card-surface p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-[13px] font-extrabold">
                ترکیب‌های سایز و رنگ ({toPersianDigits(variants.length)})
              </h2>
              <div className="flex gap-1.5">
                <button type="button" onClick={addMatrix} className="rounded-lg border border-line px-2.5 py-1.5 text-[10.5px]">
                  تکمیل ماتریس
                </button>
                <button type="button" onClick={() => addVariant()} className="rounded-lg bg-ink px-2.5 py-1.5 text-[10.5px] text-bone">
                  + ترکیب جدید
                </button>
              </div>
            </div>
            <div className="mt-3 space-y-2">
              {variants.map((variant, index) => (
                <div key={index} className="grid grid-cols-[70px_1fr_36px_70px_28px] items-center gap-1.5">
                  <select
                    value={variant.size}
                    onChange={(event) => updateVariant(index, { size: event.target.value })}
                    className="field !px-1.5 !py-1.5 !text-[11px]"
                    aria-label="سایز"
                  >
                    {SIZES.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                  <div className="flex gap-1">
                    <input
                      value={variant.colorName}
                      onChange={(event) => updateVariant(index, { colorName: event.target.value })}
                      list="color-palette"
                      className="field !px-2 !py-1.5 !text-[11px]"
                      placeholder="نام رنگ"
                      aria-label="نام رنگ"
                    />
                    <input
                      type="color"
                      value={variant.colorHex}
                      onChange={(event) => updateVariant(index, { colorHex: event.target.value })}
                      className="h-8 w-8 shrink-0 cursor-pointer rounded-lg border border-line bg-transparent"
                      aria-label="کد رنگ"
                    />
                  </div>
                  <input
                    type="number"
                    min={0}
                    value={variant.stock}
                    onChange={(event) => updateVariant(index, { stock: Number(event.target.value) })}
                    className="field !px-1 !py-1.5 text-center !text-[11px]"
                    aria-label="موجودی"
                  />
                  <span className="text-[9px] text-ink-muted">موجودی</span>
                  <button
                    type="button"
                    onClick={() => setVariants((previous) => previous.filter((_, i) => i !== index))}
                    className="grid size-7 place-items-center rounded-full border border-line text-[11px] text-clay"
                    aria-label="حذف ترکیب"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <datalist id="color-palette">
              {PALETTE.map((color) => (
                <option key={color.name} value={color.name} />
              ))}
            </datalist>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {PALETTE.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => addVariant({ colorName: color.name, colorHex: color.hex })}
                  className="flex items-center gap-1.5 rounded-full border border-line px-2 py-1 text-[10px]"
                >
                  <span className="size-3 rounded-full ring-1 ring-ink/15" style={{ backgroundColor: color.hex }} />
                  {color.name}
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-4">
          <section className="card-surface p-4">
            <h2 className="text-[13px] font-extrabold">تصاویر محصول</h2>
            <p className="mt-1 text-[10px] leading-5 text-ink-muted">
              هر خط یک آدرس تصویر. تصویر اول تصویر اصلی کارت است؛ تصویر دوم در هاور نمایش
              داده می‌شود.
            </p>
            <textarea
              value={images}
              onChange={(event) => setImages(event.target.value)}
              rows={8}
              dir="ltr"
              className="field mt-2 resize-y font-mono !text-[10px] leading-6"
              placeholder="https://images.pexels.com/photos/…jpeg"
            />
            {images
              .split("\n")
              .filter(Boolean)
              .slice(0, 3)
              .map((url) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={url}
                  src={url}
                  alt="پیش‌نمایش"
                  className="mt-2 h-28 w-full rounded-xl object-cover"
                />
              ))}
          </section>

          <section className="card-surface p-4">
            <h2 className="text-[13px] font-extrabold">ذخیره</h2>
            {error && <p className="mt-2 rounded-lg bg-clay/10 px-2.5 py-2 text-[10.5px] text-clay-dark">{error}</p>}
            <button type="submit" disabled={saving} className="btn btn-clay mt-3 w-full py-2.5 text-[12px] disabled:opacity-60">
              {saving ? "در حال ذخیره…" : product ? "ذخیرهٔ تغییرات" : "ثبت محصول"}
            </button>
            <Link href="/admin/products" className="btn btn-ghost mt-2 w-full py-2.5 text-[12px]">
              انصراف
            </Link>
            {product && (
              <button
                type="button"
                onClick={removeProduct}
                disabled={deleting}
                className="mt-2 w-full rounded-xl border border-clay/30 py-2 text-[11px] text-clay transition hover:bg-clay hover:text-white disabled:opacity-50"
              >
                {deleting ? "در حال حذف…" : "حذف محصول"}
              </button>
            )}
          </section>

          <div className="rounded-2xl border border-line bg-bone-deep/50 p-4 text-[10px] leading-5 text-ink-muted">
            موجودی هر ترکیب جداگانه کنترل می‌شود. اگر موجودی صفر شود، آن ترکیب در صفحهٔ
            محصول غیرفعال و «ناموجود» نمایش داده می‌شود.
          </div>
        </div>
      </div>
    </form>
  );
}
