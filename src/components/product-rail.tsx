"use client";

import { useRef } from "react";
import type { CatalogProduct } from "@/lib/data";
import ProductCard from "./product-card";

export default function ProductRail({ products }: { products: CatalogProduct[] }) {
  const railRef = useRef<HTMLDivElement>(null);

  function scroll(direction: number) {
    const rail = railRef.current;
    if (!rail) return;
    const step = Math.min(rail.clientWidth * 0.8, 520);
    rail.scrollBy({ left: direction * step, behavior: "smooth" });
  }

  return (
    <div className="mt-6">
      <div className="wrap mb-3 flex justify-end gap-1.5">
        <button
          type="button"
          onClick={() => scroll(-1)}
          aria-label="محصولات قبلی"
          className="grid size-9 place-items-center rounded-full border border-line bg-bone transition hover:bg-ink hover:text-bone"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => scroll(1)}
          aria-label="محصولات بعدی"
          className="grid size-9 place-items-center rounded-full border border-line bg-bone transition hover:bg-ink hover:text-bone"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div
        ref={railRef}
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-[max(1.1rem,calc((100vw-1240px)/2+2.5rem))] pb-3"
      >
        {products.map((product, index) => (
          <div key={product.id} className="w-[74%] shrink-0 snap-start sm:w-[45%] lg:w-[23.5%]">
            <ProductCard product={product} priority={index < 2} />
          </div>
        ))}
        {products.length === 0 && (
          <p className="px-6 text-sm text-ink-muted">محصولات به‌زودی بارگذاری می‌شوند.</p>
        )}
      </div>
    </div>
  );
}
