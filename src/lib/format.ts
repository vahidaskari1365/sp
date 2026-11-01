const faNumber = new Intl.NumberFormat("fa-IR");

export function toPersianDigits(value: string | number): string {
  return String(value).replace(/[0-9]/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
}

/** 2480000 -> "۲٫۴۸۰٫۰۰۰" */
export function formatNumber(value: number): string {
  return faNumber.format(Math.round(value));
}

export function formatToman(value: number): string {
  return `${formatNumber(value)} تومان`;
}

export function formatRating(rating: number): string {
  return (rating / 10).toFixed(1).replace(".", "٫");
}

export function discountPercent(price: number, compareAt?: number | null) {
  if (!compareAt || compareAt <= price) return 0;
  return Math.round(((compareAt - price) / compareAt) * 100);
}

/** Gregorian date -> Jalali string, e.g. "۱۲ اسفند ۱۴۰۴" */
export function formatJalali(date: Date | string | number): string {
  const value = date instanceof Date ? date : new Date(date);
  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(value);
}

export function formatJalaliTime(date: Date | string | number): string {
  const value = date instanceof Date ? date : new Date(date);
  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(value);
}

const PERSIAN_LETTERS = "ابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی";

/** Deterministic short code with Persian-friendly alphabet */
export function makeToken(prefix = "") {
  let out = prefix;
  for (let i = 0; i < 12; i += 1) {
    out += PERSIAN_LETTERS[
      Math.floor(Math.random() * PERSIAN_LETTERS.length)
    ];
  }
  return `${out}${Date.now().toString(36)}`;
}

export function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9\u0600-\u06FF-]/g, "")
    .replace(/-+/g, "-");
}

export const FREE_SHIPPING_THRESHOLD = 2_000_000;

export const SHIPPING_METHODS = [
  {
    id: "post",
    title: "پست پیشتاز",
    description: "ارسال به تمام نقاط ایران، ۲ تا ۴ روز کاری",
    cost: 59_000,
    carrier: "پست جمهوری اسلامی",
    eta: "۲ تا ۴ روز کاری",
  },
  {
    id: "tipax",
    title: "تیپاکس",
    description: "ارسال سریع درب منزل، ۱ تا ۳ روز کاری",
    cost: 89_000,
    carrier: "تیپاکس",
    eta: "۱ تا ۳ روز کاری",
  },
  {
    id: "peyk",
    title: "پیک تهران",
    description: "تحویل همان روز در تهران (سفارش تا ساعت ۱۲)",
    cost: 79_000,
    carrier: "پیک اختصاصی ترمه",
    eta: "همان روز",
  },
] as const;

export type ShippingMethodId = (typeof SHIPPING_METHODS)[number]["id"];

export function getShippingMethod(id: string) {
  return SHIPPING_METHODS.find((method) => method.id === id) ?? SHIPPING_METHODS[0];
}

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "در انتظار پرداخت",
  processing: "در حال آماده‌سازی",
  shipped: "مرسوله تحویل پست شد",
  delivered: "تحویل داده شد",
  canceled: "لغو شده",
};

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: "پرداخت نشده",
  paid: "پرداخت موفق",
  failed: "پرداخت ناموفق",
  refunded: "بازگشت وجه",
};

export const SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;
