import { db } from "@/db";
import { coupons, type Coupon } from "@/db/schema";
import { desc } from "drizzle-orm";
import CouponManager from "@/components/admin/coupon-manager";

export const dynamic = "force-dynamic";

export default async function AdminCouponsPage() {
  let rows: Coupon[] = [];
  try {
    rows = await db.select().from(coupons).orderBy(desc(coupons.createdAt));
  } catch {
    rows = [];
  }

  return (
    <div className="space-y-4">
      <div>
        <span className="eyebrow">بازاریابی</span>
        <h1 className="mt-1.5 text-2xl font-black">تخفیف و کد تخفیف</h1>
        <p className="mt-1 text-[11.5px] text-ink-muted">
          کد درصدی یا مبلغ ثابت بسازید، حداقل خرید و سقف تخفیف تعیین کنید و استفاده‌ها را
          رصد کنید.
        </p>
      </div>
      <CouponManager coupons={rows} />
    </div>
  );
}
