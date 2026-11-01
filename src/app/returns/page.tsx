import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "شرایط مرجوعی و تعویض سایز",
  alternates: { canonical: "/shipping" },
  robots: { index: false, follow: true },
};

export default function ReturnsPage() {
  redirect("/shipping#returns");
}
