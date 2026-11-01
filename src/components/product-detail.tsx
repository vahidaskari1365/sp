"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { CatalogProduct } from "@/lib/data";
import {
  discountPercent,
  formatNumber,
  formatRating,
  toPersianDigits,
} from "@/lib/format";
import { useCart } from "./cart-provider";

export default function ProductDetail({ product }: { product: CatalogProduct }) {
  const router = useRouter();
  const { addItem, openCart } = useCart();
  const initialColor = useMemo(
    () => product.colors.find((color) => color.stock > 0) ?? product.colors[0],
    [product.colors],
  );
  const [color, setColor] = useState(initialColor?.name ?? "");
  const [size, setSize] = useState<string | null>(() => {
    const first = product.variants.find(
      (variant) => variant.colorName === initialColor?.name && variant.stock > 0,
    );
    return first?.size ?? null;
  });
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const selectedVariant = product.variants.find(
    (variant) => variant.colorName === color && variant.size === size,
  );
  const stockForColorSize = selectedVariant?.stock ?? 0;
  const discount = discountPercent(product.price, product.compareAtPrice);
  const colorStock = (colorName: string) =>
    product.variants
      .filter((variant) => variant.colorName === colorName)
      .reduce((sum, variant) => sum + variant.stock, 0);
  const availableSizes = product.variants
    .filter((variant) => variant.colorName === color)
    .map((variant) => variant.size);

  function addToCart(goToCheckout = false) {
    if (!size || !selectedVariant || selectedVariant.stock === 0) {
      setAdded(false);
      return;
    }
    addItem({
      variantId: selectedVariant?.id ?? 0,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: product.images[0]?.url ?? null,
      price: product.price,
      size,
      colorName: color,
      qty,
      maxStock: stockForColorSize,
    });
    setAdded(true);
    if (goToCheckout) router.push("/checkout");
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
      {/* gallery */}
      <div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-[26px] bg-sand">
          {product.images[activeImage] && (
            <Image
              src={product.images[activeImage].url}
              alt={product.images[activeImage].alt ?? product.name}
              fill
              priority
              sizes="(max-width: 1024px) 92vw, 50vw"
              className="object-cover"
            />
          )}
          {discount > 0 && (
            <span className="absolute right-4 top-4 rounded-full bg-clay px-3 py-1.5 text-[11px] font-bold text-white">
              {toPersianDigits(discount)}٪ تخفیف
            </span>
          )}
          {product.badge && (
            <span className="absolute left-4 top-4 rounded-full bg-bone/95 px-3 py-1.5 text-[11px] font-semibold backdrop-blur">
              {product.badge}
            </span>
          )}
        </div>

        {product.images.length > 1 && (
          <div className="mt-3 flex gap-2.5">
            {product.images.map((image, index) => (
              <button
                key={image.url}
                type="button"
                onClick={() => setActiveImage(index)}
                aria-label={`تصویر ${toPersianDigits(index + 1)}`}
                className={`relative size-20 overflow-hidden rounded-xl border-2 transition ${
                  activeImage === index ? "border-clay" : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <Image src={image.url} alt="" fill sizes="80px" className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* info */}
      <div>
        <nav aria-label="مسیر محصول" className="flex flex-wrap items-center gap-1.5 text-[11px] text-ink-muted">
          <Link href="/" className="hover:text-clay">خانه</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-clay">فروشگاه</Link>
          {product.categorySlug && (
            <>
              <span>/</span>
              <Link href={`/products?category=${product.categorySlug}`} className="hover:text-clay">
                {product.categoryName}
              </Link>
            </>
          )}
        </nav>

        <h1 className="mt-3 text-[clamp(1.6rem,3.4vw,2.4rem)] font-black leading-tight">
          {product.name}
        </h1>
        {product.subtitle && (
          <p className="mt-1.5 text-[12.5px] text-ink-muted">{product.subtitle}</p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 text-gold">
            {Array.from({ length: 5 }).map((_, index) => (
              <svg key={index} width="13" height="13" viewBox="0 0 24 24" fill={index < Math.round(product.rating / 10) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.2" aria-hidden>
                <path d="M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.4l-5.8 3.1 1.1-6.5L2.6 9.4l6.5-.9L12 2.6Z" />
              </svg>
            ))}
            <span className="mr-1 text-[11.5px] font-semibold text-ink">{formatRating(product.rating)}</span>
          </div>
          <span className="text-[11px] text-ink-muted">
            {toPersianDigits(product.reviewCount)} نظر ثبت‌شده
          </span>
          <span className="chip text-[10px]">
            <span className={`size-1.5 rounded-full ${product.totalStock > 0 ? "bg-olive" : "bg-clay"}`} />
            {product.totalStock > 0 ? "موجود در انبار" : "ناموجود"}
          </span>
        </div>

        <div className="mt-5 flex flex-wrap items-baseline gap-3 border-y border-line py-4">
          <span className="text-2xl font-black">{formatNumber(product.price)}</span>
          <span className="text-[12px] text-ink-muted">تومان</span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <>
              <span className="price-strike text-[13px] text-ink-muted">
                {formatNumber(product.compareAtPrice)}
              </span>
              <span className="rounded-full bg-clay/10 px-2 py-1 text-[10.5px] font-bold text-clay">
                {formatNumber(product.compareAtPrice - product.price)} تومان سود شما
              </span>
            </>
          )}
        </div>

        {/* colors */}
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <p className="text-[12px] font-bold">رنگ</p>
            <span className="text-[11px] text-ink-muted">{color}</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.colors.map((option) => {
              const isSelected = color === option.name;
              const stock = colorStock(option.name);
              return (
                <button
                  key={option.name}
                  type="button"
                  onClick={() => {
                    setColor(option.name);
                    const first = product.variants.find(
                      (variant) => variant.colorName === option.name && variant.stock > 0,
                    );
                    setSize(first?.size ?? null);
                    setQty(1);
                    setAdded(false);
                  }}
                  aria-pressed={isSelected}
                  disabled={stock === 0}
                  className={`flex items-center gap-2 rounded-full border py-1.5 pl-3 pr-1.5 text-[11px] transition ${
                    isSelected
                      ? "border-ink bg-ink text-bone"
                      : "border-line bg-[#fffdf9] hover:border-ink/40"
                  } ${stock === 0 ? "cursor-not-allowed opacity-40" : ""}`}
                >
                  <span
                    className="size-5 rounded-full ring-1 ring-ink/15"
                    style={{ backgroundColor: option.hex }}
                  />
                  {option.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* sizes */}
        <div className="mt-5">
          <div className="flex items-center justify-between">
            <p className="text-[12px] font-bold">سایز</p>
            <Link href="/size-guide" className="text-[11px] text-clay underline underline-offset-4">
              راهنمای سایز
            </Link>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-6">
            {product.sizes.map((option) => {
              const inStock = availableSizes.includes(option);
              const isSelected = size === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setSize(option);
                    setQty(1);
                    setAdded(false);
                  }}
                  aria-pressed={isSelected}
                  disabled={!inStock}
                  className={`relative rounded-xl border py-2.5 text-[11.5px] font-semibold transition ${
                    isSelected
                      ? "border-clay bg-clay text-white"
                      : "border-line bg-[#fffdf9] hover:border-ink/40"
                  } ${!inStock ? "cursor-not-allowed border-dashed text-ink-muted/50 line-through" : ""}`}
                >
                  {option}
                </button>
              );
            })}
          </div>
          {product.sizes.length === 0 && (
            <p className="mt-2 text-[11px] text-ink-muted">سایزها به‌زودی ثبت می‌شوند.</p>
          )}
        </div>

        {/* stock + qty */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-bone-deep/60 px-4 py-3">
          <p className="text-[11px] text-ink-soft">
            {size && stockForColorSize > 0 ? (
              stockForColorSize <= 3 ? (
                <span className="font-semibold text-clay">
                  فقط {toPersianDigits(stockForColorSize)} عدد در سایز {size} باقی مانده
                </span>
              ) : (
                <span>
                  موجودی سایز {size} / رنگ {color}:{" "}
                  <b>{toPersianDigits(stockForColorSize)} عدد</b>
                </span>
              )
            ) : (
              "سایز خود را انتخاب کنید تا موجودی دقیق نمایش داده شود."
            )}
          </p>
          <div className="flex items-center gap-2 rounded-full border border-line bg-[#fffdf9] px-2 py-1">
            <button
              type="button"
              onClick={() => setQty((value) => Math.max(1, value - 1))}
              className="grid size-6 place-items-center text-ink-soft"
              aria-label="کاهش تعداد"
            >
              −
            </button>
            <span className="min-w-5 text-center text-[12px] font-bold">{toPersianDigits(qty)}</span>
            <button
              type="button"
              onClick={() => setQty((value) => Math.min(stockForColorSize || 1, value + 1))}
              className="grid size-6 place-items-center text-ink-soft"
              aria-label="افزایش تعداد"
            >
              +
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => addToCart(false)}
            className="btn btn-clay w-full"
            disabled={product.totalStock === 0}
          >
            {product.totalStock === 0 ? "ناموجود" : "افزودن به سبد خرید"}
          </button>
          <button
            type="button"
            onClick={() => addToCart(true)}
            className="btn btn-ink w-full"
            disabled={product.totalStock === 0}
          >
            خرید سریع
          </button>
        </div>
        {added && (
          <button
            type="button"
            onClick={openCart}
            className="mt-2 w-full rounded-full bg-olive/10 py-2 text-[11px] font-semibold text-olive"
          >
            ✓ به سبد اضافه شد — مشاهدهٔ سبد
          </button>
        )}

        <div className="mt-5 grid grid-cols-2 gap-2 text-[10.5px] text-ink-soft sm:grid-cols-3">
          {[
            { icon: "↺", label: "۷ روز تعویض سایز" },
            { icon: "🚚", label: "ارسال ۲۴ ساعته" },
            { icon: "✂️", label: "دوخت آتلیه‌ای" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5 rounded-xl border border-line bg-[#fffdf9] px-2.5 py-2">
              <span aria-hidden>{item.icon}</span>
              {item.label}
            </div>
          ))}
        </div>

        {/* accordions */}
        <div className="mt-6 divide-y divide-line border-y border-line">
          <details className="accordion py-3" open>
            <summary className="flex items-center justify-between text-[12px] font-bold">
              توضیحات محصول
              <span className="accordion-icon text-ink-muted transition-transform duration-300">+</span>
            </summary>
            <p className="mt-2 text-[11.5px] leading-7 text-ink-soft">{product.description}</p>
          </details>
          <details className="accordion py-3">
            <summary className="flex items-center justify-between text-[12px] font-bold">
              جنس و نگهداری
              <span className="accordion-icon text-ink-muted transition-transform duration-300">+</span>
            </summary>
            <div className="mt-2 space-y-1.5 text-[11.5px] leading-7 text-ink-soft">
              <p>
                <b className="text-ink">ترکیب پارچه:</b> {product.fabric}
              </p>
              <p>
                <b className="text-ink">نگهداری:</b> {product.care}
              </p>
              {product.story && <p className="text-ink-muted">{product.story}</p>}
            </div>
          </details>
          <details className="accordion py-3">
            <summary className="flex items-center justify-between text-[12px] font-bold">
              ارسال، پرداخت و مرجوعی
              <span className="accordion-icon text-ink-muted transition-transform duration-300">+</span>
            </summary>
            <div className="mt-2 space-y-1 text-[11.5px] leading-7 text-ink-soft">
              <p>ارسال با پست پیشتاز (۲–۴ روز)، تیپاکس (۱–۳ روز) یا پیک تهران (همان روز).</p>
              <p>سفارش بالای ۲ میلیون تومان ارسال رایگان دارد.</p>
              <p>پرداخت امن از طریق درگاه بانکی؛ تعویض سایز تا ۷ روز پس از دریافت.</p>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}
