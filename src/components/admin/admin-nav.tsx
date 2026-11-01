"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const ITEMS = [
  { href: "/admin", label: "داشبورد", icon: "▦" },
  { href: "/admin/products", label: "محصولات", icon: "◈" },
  { href: "/admin/orders", label: "سفارش‌ها", icon: "❑" },
  { href: "/admin/coupons", label: "کدهای تخفیف", icon: "％" },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {ITEMS.map((item) => {
        const active =
          item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[11.5px] font-medium transition ${
              active
                ? "bg-ink text-bone"
                : "border border-line bg-[#fffdf9] text-ink-soft hover:border-ink/25"
            }`}
          >
            <span aria-hidden className="text-[11px]">{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
      <Link
        href="/"
        className="rounded-full border border-line bg-[#fffdf9] px-3.5 py-2 text-[11.5px] text-ink-soft transition hover:border-ink/25"
      >
        فروشگاه ↗
      </Link>
      <button
        type="button"
        onClick={logout}
        className="rounded-full border border-clay/30 px-3.5 py-2 text-[11.5px] font-semibold text-clay transition hover:bg-clay hover:text-white"
      >
        خروج
      </button>
    </div>
  );
}
