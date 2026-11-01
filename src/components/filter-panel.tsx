"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { toPersianDigits } from "@/lib/format";

type Option = { value: string; label: string; count?: number };

export default function FilterPanel({
  categories,
  sizes,
  colors,
  resultCount,
}: {
  categories: Option[];
  sizes: string[];
  colors: { name: string; hex: string }[];
  resultCount: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const active = useMemo(
    () => ({
      category: searchParams.get("category") ?? "",
      sizes: searchParams.getAll("size"),
      colors: searchParams.getAll("color"),
      min: searchParams.get("min") ?? "",
      max: searchParams.get("max") ?? "",
      q: searchParams.get("q") ?? "",
      inStock: searchParams.get("inStock") === "1",
      sort: searchParams.get("sort") ?? "newest",
    }),
    [searchParams],
  );

  function apply(updates: Record<string, string | string[] | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      params.delete(key);
      if (Array.isArray(value)) value.forEach((item) => params.append(key, item));
      else if (value) params.set(key, value);
    }
    router.push(`/products?${params.toString()}`, { scroll: false });
  }

  function toggleMulti(key: "size" | "color", value: string) {
    const current = searchParams.getAll(key);
    const next = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
    apply({ [key]: next });
  }

  const activeCount =
    (active.category ? 1 : 0) +
    active.sizes.length +
    active.colors.length +
    (active.min || active.max ? 1 : 0) +
    (active.inStock ? 1 : 0) +
    (active.q ? 1 : 0);

  const content = (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-bold text-ink">جست‌وجو</p>
        <form
          className="mt-2 flex items-center gap-2 rounded-full border border-line bg-[#fffdf9] px-3 py-2"
          onSubmit={(event) => {
            event.preventDefault();
            const value = new FormData(event.currentTarget).get("q") as string;
            apply({ q: value || null });
          }}
        >
          <input
            name="q"
            defaultValue={active.q}
            placeholder="نام محصول…"
            className="w-full bg-transparent text-xs outline-none"
            aria-label="جست‌وجوی محصول"
          />
          <button type="submit" aria-label="اعمال جست‌وجو" className="text-clay">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.7" />
              <path d="m20 20-3.6-3.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </button>
        </form>
      </div>

      <div>
        <p className="text-[11px] font-bold">دسته‌بندی</p>
        <div className="mt-2 space-y-1">
          <button
            type="button"
            onClick={() => apply({ category: null })}
            className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-[12px] transition ${
              !active.category ? "bg-ink text-bone" : "hover:bg-sand/60"
            }`}
          >
            همهٔ محصولات
          </button>
          {categories.map((category) => (
            <button
              key={category.value}
              type="button"
              onClick={() => apply({ category: category.value })}
              className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-[12px] transition ${
                active.category === category.value ? "bg-ink text-bone" : "hover:bg-sand/60"
              }`}
            >
              <span>{category.label}</span>
              {category.count !== undefined && (
                <span className="text-[10px] opacity-60">{toPersianDigits(category.count)}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[11px] font-bold">سایز</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {sizes.map((size) => {
            const isActive = active.sizes.includes(size);
            return (
              <button
                key={size}
                type="button"
                onClick={() => toggleMulti("size", size)}
                className={`min-w-10 rounded-lg border px-2.5 py-1.5 text-[11px] transition ${
                  isActive
                    ? "border-ink bg-ink text-bone"
                    : "border-line bg-[#fffdf9] hover:border-ink/40"
                }`}
                aria-pressed={isActive}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-[11px] font-bold">رنگ</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {colors.map((color) => {
            const isActive = active.colors.includes(color.name);
            return (
              <button
                key={color.name}
                type="button"
                onClick={() => toggleMulti("color", color.name)}
                title={color.name}
                aria-pressed={isActive}
                className={`grid size-8 place-items-center rounded-full border transition ${
                  isActive ? "border-clay ring-2 ring-clay/25" : "border-line hover:border-ink/30"
                }`}
              >
                <span
                  className="size-5 rounded-full ring-1 ring-ink/10"
                  style={{ backgroundColor: color.hex }}
                />
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-[11px] font-bold">محدودهٔ قیمت (تومان)</p>
        <form
          key={`${active.min}-${active.max}`}
          className="mt-2 flex items-center gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            apply({
              min: (data.get("min") as string) || null,
              max: (data.get("max") as string) || null,
            });
          }}
        >
          <input
            name="min"
            defaultValue={active.min}
            inputMode="numeric"
            placeholder="از ۰"
            className="field !py-2 !text-[11px]"
            aria-label="کمترین قیمت"
          />
          <span className="text-ink-muted">—</span>
          <input
            name="max"
            defaultValue={active.max}
            inputMode="numeric"
            placeholder="تا ۵٬۰۰۰٬۰۰۰"
            className="field !py-2 !text-[11px]"
            aria-label="بیشترین قیمت"
          />
          <button type="submit" className="rounded-lg bg-sand px-3 py-2 text-[11px] font-semibold">
            اعمال
          </button>
        </form>
      </div>

      <label className="flex cursor-pointer items-center justify-between rounded-xl border border-line bg-[#fffdf9] px-3 py-2.5">
        <span className="text-[11.5px]">فقط کالاهای موجود</span>
        <input
          type="checkbox"
          checked={active.inStock}
          onChange={(event) => apply({ inStock: event.target.checked ? "1" : null })}
          className="size-4 accent-[#b4552f]"
        />
      </label>

      {activeCount > 0 && (
        <button
          type="button"
          onClick={() => router.push("/products")}
          className="w-full rounded-xl border border-clay/40 px-3 py-2 text-[11.5px] font-semibold text-clay transition hover:bg-clay hover:text-white"
        >
          پاک کردن {toPersianDigits(activeCount)} فیلتر
        </button>
      )}
    </div>
  );

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-3 lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="btn btn-ghost px-4 py-2.5 text-[12px]"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M4 7h16M7 12h10M10 17h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
          فیلترها
          {activeCount > 0 && (
            <span className="grid size-4 place-items-center rounded-full bg-clay text-[9px] text-white">
              {toPersianDigits(activeCount)}
            </span>
          )}
        </button>
        <p className="text-[11px] text-ink-muted">{toPersianDigits(resultCount)} محصول</p>
      </div>

      <aside className="hidden lg:block">
        <div className="card-surface sticky top-28 p-5">{content}</div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-[65] lg:hidden">
          <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 right-0 w-[88%] max-w-sm overflow-y-auto bg-bone p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-extrabold">فیلترها</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="بستن فیلترها"
                className="grid size-8 place-items-center rounded-full border border-line"
              >
                ✕
              </button>
            </div>
            {content}
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="btn btn-clay mt-5 w-full text-[13px]"
            >
              نمایش {toPersianDigits(resultCount)} محصول
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export function SortSelect({ value }: { value: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  return (
    <select
      aria-label="ترتیب نمایش"
      value={value}
      onChange={(event) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("sort", event.target.value);
        router.push(`/products?${params.toString()}`, { scroll: false });
      }}
      className="rounded-full border border-line bg-[#fffdf9] px-3 py-2 text-[11.5px] outline-none"
    >
      <option value="newest">جدیدترین</option>
      <option value="rating">محبوب‌ترین</option>
      <option value="price-asc">ارزان‌ترین</option>
      <option value="price-desc">گران‌ترین</option>
    </select>
  );
}


