"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="wrap flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <span className="grid size-16 place-items-center rounded-full bg-clay/10 text-2xl text-clay">!</span>
      <h1 className="mt-4 text-2xl font-black">مشکلی در بارگذاری پیش آمد</h1>
      <p className="mt-2 max-w-sm text-[12.5px] leading-7 text-ink-muted">
        اتصال به سرور یا پایگاه داده برقرار نشد. چند لحظه بعد دوباره تلاش کنید؛ سبد خرید
        شما در مرورگر ذخیره شده است.
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        <button type="button" onClick={reset} className="btn btn-clay text-[13px]">
          تلاش مجدد
        </button>
        <Link href="/" className="btn btn-ghost text-[13px]">
          صفحهٔ اصلی
        </Link>
      </div>
    </div>
  );
}
