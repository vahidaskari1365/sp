import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";

const COOKIE_NAME = "termeh_admin";

let warnedAboutSecret = false;

function secret() {
  const configured = process.env.AUTH_SECRET;
  if (configured && configured.length > 0) return configured;

  if (process.env.NODE_ENV === "production" && !warnedAboutSecret) {
    warnedAboutSecret = true;
    console.warn(
      "[auth] AUTH_SECRET is not set. Falling back to a key derived from ADMIN_PASSWORD — set AUTH_SECRET in production to invalidate forged sessions.",
    );
  }
  return `termeh:${adminPassword()}:session-key`;
}

function adminPassword() {
  return process.env.ADMIN_PASSWORD ?? "termeh1404";
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("hex");
}

export function createSessionValue() {
  const issued = Date.now().toString();
  return `${issued}.${sign(issued)}`;
}

export function verifySessionValue(value?: string | null) {
  if (!value) return false;
  const [issued, signature] = value.split(".");
  if (!issued || !signature) return false;
  const expected = sign(issued);
  if (expected.length !== signature.length) return false;
  try {
    if (!timingSafeEqual(Buffer.from(expected), Buffer.from(signature))) {
      return false;
    }
  } catch {
    return false;
  }
  // 14 day expiry
  return Date.now() - Number(issued) < 14 * 24 * 60 * 60 * 1000;
}

export function checkPassword(password: string) {
  const expected = adminPassword();
  if (password.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(password), Buffer.from(expected));
}

export async function isAdmin() {
  const store = await cookies();
  return verifySessionValue(store.get(COOKIE_NAME)?.value);
}

export async function setAdminCookie() {
  const store = await cookies();
  store.set(COOKIE_NAME, createSessionValue(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 14 * 24 * 60 * 60,
    secure: process.env.NODE_ENV === "production",
  });
}

export async function clearAdminCookie() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export const ADMIN_COOKIE = COOKIE_NAME;
