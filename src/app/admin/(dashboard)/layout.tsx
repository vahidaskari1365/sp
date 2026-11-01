import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import AdminNav from "@/components/admin/admin-nav";

export const metadata: Metadata = {
  title: "پنل مدیریت",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const allowed = await isAdmin();
  if (!allowed) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-bone-deep/40">
      <div className="border-b border-line bg-bone">
        <div className="wrap flex flex-wrap items-center justify-between gap-3 py-3.5">
          <Link href="/admin" className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-full bg-ink text-bone">
              <span className="font-latin text-base">T</span>
            </span>
            <span>
              <span className="block text-[13px] font-extrabold leading-4">پنل مدیریت ترمه</span>
              <span className="font-latin text-[9px] tracking-[0.25em] text-ink-muted">
                STORE OPERATIONS
              </span>
            </span>
          </Link>
          <AdminNav />
        </div>
      </div>
      <div className="wrap py-6">{children}</div>
    </div>
  );
}
