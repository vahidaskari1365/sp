import type { MetadataRoute } from "next";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/cart", "/checkout", "/orders/", "/pay/", "/api/"],
      },
      {
        userAgent: ["GPTBot", "PerplexityBot", "Google-Extended", "ClaudeBot", "OAI-SearchBot"],
        allow: ["/", "/products", "/faq", "/size-guide", "/about", "/shipping"],
        disallow: ["/admin", "/cart", "/checkout", "/orders/", "/pay/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
