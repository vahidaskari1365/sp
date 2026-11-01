import { db, isDatabaseConfigured } from "@/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  if (!isDatabaseConfigured()) {
    return Response.json(
      {
        ok: false,
        database: "not_configured",
        message:
          "DATABASE_URL is missing. Add it in your hosting environment variables (Vercel → Settings → Environment Variables).",
      },
      { status: 500 },
    );
  }

  try {
    await db.execute(sql`select 1`);
    return Response.json({ ok: true, database: "connected" });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        database: "unreachable",
        message: error instanceof Error ? error.message : "database connection failed",
      },
      { status: 500 },
    );
  }
}
