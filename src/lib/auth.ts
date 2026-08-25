import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "windows-learning-super-secret-production-key-2026";
const COOKIE_NAME = "wl_session";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  roles: string[];
  activeRole: string;
  learnerOnboardingComplete: boolean;
  mentorOnboardingComplete: boolean;
}

// Simple, fast Base64URL + HMAC-SHA256 Token encoder/decoder using Web Crypto API
async function getSigningKey() {
  const enc = new TextEncoder();
  return await crypto.subtle.importKey(
    "raw",
    enc.encode(JWT_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlDecode(str: string): string {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) {
    str += "=";
  }
  return Buffer.from(str, "base64").toString();
}

export async function createSessionToken(user: SessionUser): Promise<string> {
  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payloadData = {
    sub: user.id,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl || "",
    roles: user.roles,
    activeRole: user.activeRole,
    learnerOnboardingComplete: user.learnerOnboardingComplete,
    mentorOnboardingComplete: user.mentorOnboardingComplete,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 30 days
  };
  const payload = base64UrlEncode(JSON.stringify(payloadData));
  const data = new TextEncoder().encode(`${header}.${payload}`);

  const key = await getSigningKey();
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, data);
  const signature = Buffer.from(signatureBuffer)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  return `${header}.${payload}.${signature}`;
}

export async function verifySessionToken(token: string): Promise<SessionUser | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [header, payload, signature] = parts;
    const data = new TextEncoder().encode(`${header}.${payload}`);
    const key = await getSigningKey();

    const expectedSig = Buffer.from(signature.replace(/-/g, "+").replace(/_/g, "/"), "base64");
    const isValid = await crypto.subtle.verify("HMAC", key, expectedSig, data);
    if (!isValid) return null;

    const parsed = JSON.parse(base64UrlDecode(payload));
    if (parsed.exp && parsed.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }

    return {
      id: parsed.sub,
      email: parsed.email,
      name: parsed.name,
      avatarUrl: parsed.avatarUrl || undefined,
      roles: parsed.roles || ["LEARNER"],
      activeRole: parsed.activeRole || "LEARNER",
      learnerOnboardingComplete: !!parsed.learnerOnboardingComplete,
      mentorOnboardingComplete: !!parsed.mentorOnboardingComplete,
    };
  } catch {
    return null;
  }
}

export async function getSessionFromCookies(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(COOKIE_NAME);
  if (!sessionCookie?.value) return null;
  return await verifySessionToken(sessionCookie.value);
}

export const COOKIE_OPTIONS = {
  name: COOKIE_NAME,
  options: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
};
