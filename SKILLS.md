# اسکیل‌ها و راهنماهای اعمال‌شده در پروژهٔ «ترمه»

این مخازن در محیط اجرای این پروژه به‌صورت خودکار نصب نشده‌اند (اسکیل‌های Claude Code هستند)،
اما اصول و چک‌لیست‌های آن‌ها به‌صورت مستقیم در طراحی، کد و ساختار پروژه پیاده شده است.
برای استفادهٔ محلی می‌توانید هر مخزن را در `~/.claude/skills` کلون کنید؛ خروجی طراحی
همین حالا بر پایهٔ همان اصول است.

| اسکیل / مخزن | کاربرد در این پروژه |
| --- | --- |
| `Leonxlnx/taste-skill` · `irfanfaraaz/taste-skill-plugin` | سلسله‌مراتب بصری، فاصله‌گذاری، تایپوگرافی ادیتوریال، گرید نامتقارن، پرهیز از قالب‌های تکراری |
| `pbakaus/impeccable` | دقت در جزئیات: حالت‌های hover/focus، حالت خالی، اسکلتون لودینگ، پیام خطای فارسی، دسترس‌پذیری |
| `vercel-labs/agent-skills` (web-design-guidelines) | RTL صحیح، کنتراست، اندازهٔ هدف لمسی، `prefers-reduced-motion`، skip-link |
| `microsoft/playwright-cli` | چک‌لیست جریان‌های اصلی: خانه ← محصول ← سبد ← پرداخت ← سفارش، و پنل مدیریت |
| `VoltAgent/awesome-design-md` · `nextlevelbuilder/ui-ux-pro-max-skill` | سیستم طراحی چندلایه (توکن رنگ/فاصله/شعاع)، کامپوننت‌های قابل ترکیب |
| `img2threejs` / `taste-skill/image-to-code` | تبدیل زبان بصری ادیتوریال مد به گرید و کارت‌های واقعی محصول |
| `magicuidesign/*` (magicui, portfolio, blog-template, app-template) | الگوهای مارکی، بیتو/بنشو، استیکی‌هدر، مارکی لوگو، کارت‌های تعاملی |
| `github/awesome-copilot` | ساختار پروژه، نام‌گذاری، لایه‌بندی data/lib/components |
| `AgriciDaniel/claude-seo` · `AminForou/mcp-gsc` · `every-app/open-seo` · `Auriti-Labs/geo-optimizer-skill` | SEO/AEO/GEO: متادیتای صفحه‌ها، JSON-LD (Product, Offer, FAQPage, Organization, BreadcrumbList, ItemList)، sitemap، robots برای ربات‌های AI، محتوای پاسخ‌محور |
| `diegosouzapw/OmniRoute` · `mnfst/awesome-free-llm-apis` · `Agent-Reach` · `ECC` · `mattpocock/skills` · `ai-engineering-hub` | معماری ماژولار، اعتبارسنجی سمت سرور، آمادهٔ اتصال به سرویس‌های AI/پیامک/پست |

## راهبردهای SEO / AEO / GEO / AIO / SXO در پروژه

- **SEO پایه:** `metadata` کامل فارسی، canonical، OG/Twitter، sitemap داینامیک، robots، ساختار URL خوانا.
- **Technical SEO:** رندر سمت سرور، تصاویر بهینه‌شدهٔ Next/Image (AVIF/WebP)، هدرهای امنیتی، بدون محتوای تکراری، دستهٔ فیلترشدهٔ قابل ایندکس.
- **Semantic / Entity SEO:** ساختار دسته‌ها و خوشهٔ محتوایی (خانه، دسته، محصول، راهنما، سؤالات)، JSON-LD موجودیت‌محور.
- **AEO (پاسخ‌محور):** بخش پرسش‌های پرتکرار با `FAQPage`، پاسخ‌های کوتاه و صریح دربارهٔ سایز، ارسال، پرداخت.
- **GEO / AIO:** محتوای قابل استناد (ترکیب پارچه، شرایط مرجوعی، جدول سایز)، robots برای GPTBot/PerplexityBot، داده‌های ساختاریافته و برند پایدار.
- **SXO:** فرآیند خرید سه‌مرحله‌ای، اعتمادسازی (ضمانت، بازگشت، پیامک)، موجودی شفاف، فیلتر و جست‌وجوی سریع، موبایل‌فرست.

## متغیرهای محیطی

| کلید | کاربرد |
| --- | --- |
| `DATABASE_URL` | اتصال PostgreSQL |
| `ADMIN_PASSWORD` | رمز ورود پنل مدیریت (پیش‌فرض دمو: `termeh1404`) |
| `AUTH_SECRET` | امضای کوکی نشست مدیر |
| `NEXT_PUBLIC_SITE_URL` | آدرس عمومی سایت برای canonical/sitemap |
| `KAVENEGAR_API_KEY` / `KAVENEGAR_SENDER` | ارسال واقعی پیامک وضعیت سفارش (بدون کلید: شبیه‌سازی و لاگ) |
| `ZARINPAL_MERCHANT_ID` | محل اتصال درگاه واقعی در `src/app/api/payments/verify` |

## اجرا

```bash
npx drizzle-kit push     # ساخت جدول‌ها
node scripts/seed.mjs    # دادهٔ نمونه (محصول، تنوع سایز/رنگ، سفارش، کد تخفیف)
npm run build && npm start
```
