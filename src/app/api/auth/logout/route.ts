import { NextResponse } from "next/server";
import { COOKIE_OPTIONS } from "@/lib/auth";

export async function POST() {
  const res = NextResponse.json({ success: true, message: "Logged out successfully." });
  res.cookies.set(COOKIE_OPTIONS.name, "", {
    ...COOKIE_OPTIONS.options,
    maxAge: 0,
  });
  return res;
}
