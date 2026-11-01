import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  tagline: text("tagline"),
  image: text("image"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  subtitle: text("subtitle"),
  description: text("description").notNull().default(""),
  story: text("story"),
  fabric: text("fabric"),
  care: text("care"),
  price: integer("price").notNull(),
  compareAtPrice: integer("compare_at_price"),
  categoryId: integer("category_id").references(() => categories.id, {
    onDelete: "set null",
  }),
  isFeatured: boolean("is_featured").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),
  badge: text("badge"),
  rating: integer("rating").notNull().default(48),
  reviewCount: integer("review_count").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const productImages = pgTable("product_images", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  alt: text("alt"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const variants = pgTable(
  "variants",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    size: text("size").notNull(),
    colorName: text("color_name").notNull(),
    colorHex: text("color_hex").notNull().default("#14100c"),
    stock: integer("stock").notNull().default(0),
    sku: text("sku"),
  },
  (table) => [
    uniqueIndex("variants_product_size_color_idx").on(
      table.productId,
      table.size,
      table.colorName,
    ),
  ],
);

export const coupons = pgTable("coupons", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  type: text("type").notNull().default("percent"),
  value: integer("value").notNull(),
  minSubtotal: integer("min_subtotal").notNull().default(0),
  maxDiscount: integer("max_discount"),
  maxUses: integer("max_uses").notNull().default(0),
  usedCount: integer("used_count").notNull().default(0),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  token: text("token").notNull().unique(),
  orderNumber: text("order_number").notNull().unique(),
  customerName: text("customer_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  province: text("province").notNull(),
  city: text("city").notNull(),
  address: text("address").notNull(),
  postalCode: text("postal_code"),
  note: text("note"),
  shippingMethod: text("shipping_method").notNull().default("post"),
  shippingCost: integer("shipping_cost").notNull().default(0),
  subtotal: integer("subtotal").notNull(),
  discount: integer("discount").notNull().default(0),
  total: integer("total").notNull(),
  couponCode: text("coupon_code"),
  paymentStatus: text("payment_status").notNull().default("pending"),
  status: text("status").notNull().default("pending"),
  carrier: text("carrier"),
  trackingCode: text("tracking_code"),
  smsStatus: text("sms_status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: integer("product_id"),
  variantId: integer("variant_id"),
  name: text("name").notNull(),
  slug: text("slug"),
  image: text("image"),
  size: text("size").notNull(),
  colorName: text("color_name").notNull(),
  unitPrice: integer("unit_price").notNull(),
  qty: integer("qty").notNull(),
  lineTotal: integer("line_total").notNull(),
});

export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  phone: text("phone").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Product = typeof products.$inferSelect;
export type ProductImage = typeof productImages.$inferSelect;
export type Variant = typeof variants.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
export type Coupon = typeof coupons.$inferSelect;
