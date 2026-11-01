import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import CartProvider from "@/components/cart-provider";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import CartDrawer from "@/components/cart-drawer";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ترمه | پوشاک معاصر ایرانی — خرید آنلاین لباس با ارسال سریع",
    template: "%s | ترمه",
  },
  description:
    "ترمه، خانهٔ پوشاک معاصر ایرانی: پالتو، پیراهن، بافت و شلوار با پارچهٔ طبیعی و دوخت آتلیه‌ای. خرید آنلاین با ارسال ۲۴ ساعته، ۷ روز ضمانت بازگشت و پرداخت امن.",
  keywords: [
    "خرید لباس زنانه",
    "پوشاک مردانه",
    "پالتو پشمی",
    "پیراهن ابریشمی",
    "خرید آنلاین پوشاک",
    "فروشگاه اینترنتی لباس",
    "ترمه",
  ],
  authors: [{ name: "ترمه" }],
  creator: "ترمه",
  publisher: "ترمه",
  applicationName: "ترمه",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "fa_IR",
    siteName: "ترمه",
    title: "ترمه | پوشاک معاصر ایرانی",
    description:
      "کالکشن پالتو، پیراهن ابریشمی، بافت مرینوس و شلوار کتان با دوخت آتلیه‌ای. ارسال سریع به سراسر ایران.",
    images: [
      {
        url: "https://images.pexels.com/photos/19271547/pexels-photo-19271547.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200&h=630",
        width: 1200,
        height: 630,
        alt: "کالکشن پوشاک ترمه",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ترمه | پوشاک معاصر ایرانی",
    description: "پوشاک با پارچهٔ طبیعی و دوخت آتلیه‌ای، ارسال سریع به سراسر ایران.",
    images: [
      "https://images.pexels.com/photos/19271547/pexels-photo-19271547.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200&h=630",
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  formatDetection: { telephone: true, address: true },
  category: "shopping",
};

export const viewport: Viewport = {
  themeColor: "#f8f2e8",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "ترمه",
      alternateName: "Termeh",
      url: siteUrl,
      logo: `${siteUrl}/logo.svg`,
      description:
        "خانهٔ پوشاک معاصر ایرانی با تمرکز بر پارچهٔ طبیعی، دوخت آتلیه‌ای و طراحی مینیمال.",
      address: {
        "@type": "PostalAddress",
        addressCountry: "IR",
        addressLocality: "تهران",
        streetAddress: "خیابان ولیعصر، بالاتر از پارک ساعی، پلاک ۲۱۴",
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+98-21-88000000",
        contactType: "customer service",
        areaServed: "IR",
        availableLanguage: ["fa", "en"],
      },
      sameAs: ["https://instagram.com/termeh", "https://t.me/termeh"],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "ترمه",
      inLanguage: "fa-IR",
      publisher: { "@id": `${siteUrl}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: `${siteUrl}/products?q={search_term_string}` },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "OnlineStore",
      "@id": `${siteUrl}/#store`,
      name: "ترمه",
      url: siteUrl,
      image: `${siteUrl}/logo.svg`,
      priceRange: "۰ تومان – ۵٬۰۰۰٬۰۰۰ تومان",
      currenciesAccepted: "IRR",
      paymentAccepted: "کارت بانکی، درگاه زرین‌پال",
      areaServed: "IR",
    },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.pexels.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..700;1,400..600&display=swap"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="min-h-screen bg-bone text-ink antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:right-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-2 focus:text-sm focus:text-bone"
        >
          رفتن به محتوای اصلی
        </a>
        <CartProvider>
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
