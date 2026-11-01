import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap flex min-h-[65vh] flex-col items-center justify-center py-16 text-center">
      <p className="font-latin text-[clamp(4rem,14vw,9rem)] font-bold leading-none text-clay/25">404</p>
      <h1 className="mt-2 text-2xl font-black">این صفحه در کمد ما پیدا نشد.</h1>
      <p className="mt-3 max-w-sm text-[12.5px] leading-7 text-ink-muted">
        ممکن است محصول از کالکشن خارج شده باشد یا نشانی را اشتباه وارد کرده باشید. از
        فروشگاه شروع کنید یا محصولات پرفروش را ببینید.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Link href="/products" className="btn btn-clay text-[13px]">
          رفتن به فروشگاه
        </Link>
        <Link href="/" className="btn btn-ghost text-[13px]">
          صفحهٔ اصلی
        </Link>
        <Link href="/track" className="btn btn-ghost text-[13px]">
          پیگیری سفارش
        </Link>
      </div>
    </div>
  );
}
