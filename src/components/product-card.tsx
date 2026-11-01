import Image from "next/image";
import Link from "next/link";
import type { CatalogProduct } from "@/lib/data";
import { discountPercent, formatNumber, formatRating } from "@/lib/format";

export default function ProductCard({
  product,
  priority = false,
  compact = false,
}: {
  product: CatalogProduct;
  priority?: boolean;
  compact?: boolean;
}) {
  const discount = discountPercent(product.price, product.compareAtPrice);
  const soldOut = product.totalStock === 0;
  const lowStock =
    product.totalStock > 0 &&
    product.variants.filter((variant) => variant.stock > 0).length <= 3;
  const hoverImage = product.images[1]?.url;

  return (
    <article className="group relative flex h-full flex-col">
      <Link
        href={`/products/${product.slug}`}
        className="relative block overflow-hidden rounded-[22px] bg-sand"
        aria-label={product.name}
      >
        <div className={`relative ${compact ? "aspect-[3/4]" : "aspect-[4/5]"} w-full`}>
          {product.images[0] && (
            <Image
              src={product.images[0].url}
              alt={product.images[0].alt ?? product.name}
              fill
              priority={priority}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={`object-cover transition-all duration-[1100ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.05] ${
                hoverImage ? "group-hover:opacity-0" : ""
              }`}
            />
          )}
          {hoverImage && (
            <Image
              src={hoverImage}
              alt={`${product.name} — نمای دوم`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="scale-105 object-cover opacity-0 transition-all duration-[1100ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-100 group-hover:opacity-100"
            />
          )}
        </div>

        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1.5">
            {product.badge && (
              <span className="rounded-full bg-ink/90 px-2.5 py-1 text-[10px] font-semibold text-bone backdrop-blur">
                {product.badge}
              </span>
            )}
            {discount > 0 && (
              <span className="rounded-full bg-clay px-2.5 py-1 text-[10px] font-bold text-white">
                {formatNumber(discount)}٪ تخفیف
              </span>
            )}
          </div>
          {soldOut ? (
            <span className="rounded-full bg-bone/95 px-2.5 py-1 text-[10px] font-semibold text-ink">
              ناموجود
            </span>
          ) : lowStock ? (
            <span className="rounded-full bg-bone/95 px-2.5 py-1 text-[10px] font-semibold text-clay">
              موجودی محدود
            </span>
          ) : null}
        </div>

        <div className="pointer-events-none absolute inset-x-2 bottom-2 translate-y-3 rounded-full bg-bone/95 px-3 py-2 text-center text-[11px] font-semibold text-ink opacity-0 backdrop-blur transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          مشاهده و انتخاب سایز
        </div>
      </Link>

      <div className="flex flex-1 flex-col pt-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[13.5px] font-bold leading-6">
            <Link href={`/products/${product.slug}`} className="transition hover:text-clay">
              {product.name}
            </Link>
          </h3>
          <span className="mt-1 flex shrink-0 items-center gap-0.5 text-[10.5px] text-ink-muted">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden className="text-gold">
              <path d="M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.4l-5.8 3.1 1.1-6.5L2.6 9.4l6.5-.9L12 2.6Z" />
            </svg>
            {formatRating(product.rating)}
          </span>
        </div>
        {product.subtitle && (
          <p className="mt-0.5 line-clamp-1 text-[11.5px] text-ink-muted">{product.subtitle}</p>
        )}
        <div className="mt-2 flex items-center gap-2">
          {product.colors.slice(0, 4).map((color) => (
            <span
              key={color.name}
              title={color.name}
              className="size-3 rounded-full ring-1 ring-ink/15 ring-offset-1 ring-offset-bone"
              style={{ backgroundColor: color.hex }}
            />
          ))}
          {product.colors.length > 4 && (
            <span className="text-[10px] text-ink-muted">+{formatNumber(product.colors.length - 4)}</span>
          )}
        </div>
        <div className="mt-2 flex flex-wrap items-baseline gap-x-2">
          <span className="text-sm font-extrabold">{formatNumber(product.price)}</span>
          <span className="text-[11px] text-ink-muted">تومان</span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="price-strike text-[11px] text-ink-muted">
              {formatNumber(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
