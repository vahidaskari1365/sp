import { isDatabaseConfigured } from "@/db";

/**
 * Dev/deployment helper banner.
 * Renders only when the database is not configured, or when it is configured
 * but the catalog is empty (schema/seed not applied yet).
 */
export default function DbNotice({ dbEmpty = false }: { dbEmpty?: boolean }) {
  const configured = isDatabaseConfigured();
  if (configured && !dbEmpty) return null;

  return (
    <div className="wrap pt-5">
      <div
        className={`rounded-2xl border px-4 py-3 text-[11.5px] leading-6 ${
          configured
            ? "border-gold/40 bg-gold/10 text-ink-soft"
            : "border-clay/35 bg-clay/8 text-ink-soft"
        }`}
        role="status"
      >
        <p className="font-bold text-ink">
          {configured
            ? "دیتابیس متصل است اما جدول‌ها خالی هستند"
            : "اتصال دیتابیس تنظیم نشده — برند به‌صورت نمایشی بالا آمده است"}
        </p>
        {configured ? (
          <p className="mt-1">
            اسکیما و داده‌های نمونه را اجرا کنید:{" "}
            <code className="rounded bg-bone-deep px-1.5 py-0.5 font-mono text-[10.5px]" dir="ltr">
              npx drizzle-kit push
            </code>{" "}
            سپس{" "}
            <code className="rounded bg-bone-deep px-1.5 py-0.5 font-mono text-[10.5px]" dir="ltr">
              node scripts/seed.mjs
            </code>
          </p>
        ) : (
          <>
            <p className="mt-1">
              در Vercel از مسیر{" "}
              <b>Project → Settings → Environment Variables</b> متغیر{" "}
              <code className="rounded bg-bone-deep px-1.5 py-0.5 font-mono text-[10.5px]" dir="ltr">
                DATABASE_URL
              </code>{" "}
              را به یک PostgreSQL ابری (Neon / Supabase / Railway) اضافه کنید و سپس اسکیما را
              بسازید:
            </p>
            <pre
              className="mt-2 overflow-x-auto rounded-xl bg-ink/90 px-3 py-2 font-mono text-[10px] leading-6 text-bone"
              dir="ltr"
            >
              npx drizzle-kit push --dialect postgresql --schema ./src/db/schema.ts --url "$DATABASE_URL"
              <br />
              node scripts/seed.mjs
            </pre>
            <p className="mt-2 text-[10.5px] text-ink-muted">
              متغیرهای لازم دیگر: <span dir="ltr">ADMIN_PASSWORD</span>،{" "}
              <span dir="ltr">AUTH_SECRET</span> و <span dir="ltr">NEXT_PUBLIC_SITE_URL</span>.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
