"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ProductRowActions({
  id,
  name,
  isActive,
}: {
  id: number;
  name: string;
  isActive: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function toggle() {
    setBusy(true);
    await fetch("/api/admin/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, quickActive: true, isActive: !isActive }),
    });
    router.refresh();
    setBusy(false);
  }

  async function remove() {
    if (!window.confirm(`محصول «${name}» حذف شود؟`)) return;
    setBusy(true);
    await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
    router.refresh();
    setBusy(false);
  }

  return (
    <div className="flex items-center justify-end gap-1.5">
      <button
        type="button"
        onClick={toggle}
        disabled={busy}
        className={`rounded-full px-2.5 py-1 text-[9.5px] font-semibold transition disabled:opacity-50 ${
          isActive ? "bg-olive/10 text-olive" : "bg-sand text-ink-muted"
        }`}
      >
        {isActive ? "فعال" : "غیرفعال"}
      </button>
      <button
        type="button"
        onClick={remove}
        disabled={busy}
        aria-label="حذف"
        className="grid size-7 place-items-center rounded-full border border-line text-[10px] text-clay transition hover:bg-clay hover:text-white disabled:opacity-50"
      >
        ✕
      </button>
    </div>
  );
}
