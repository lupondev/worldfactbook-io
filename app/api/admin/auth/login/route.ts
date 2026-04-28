import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST { "password": "<ADMIN_SECRET>" } sets httpOnly `admin_token` when ADMIN_SECRET is set.
 * In development with no ADMIN_SECRET, admin routes are unlocked by middleware; this returns ok with no cookie.
 */
export async function POST(request: Request) {
  const secret = process.env.ADMIN_SECRET?.trim();
  const body = (await request.json().catch(() => ({}))) as { password?: string; next?: string };

  if (!secret || secret.length === 0) {
    if (process.env.NODE_ENV !== "production") {
      return NextResponse.json({ ok: true, dev: true, message: "ADMIN_SECRET unset; middleware allows /admin locally." });
    }
    return NextResponse.json({ error: "Admin not configured" }, { status: 503 });
  }

  if (body.password !== secret) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const next = typeof body.next === "string" && body.next.startsWith("/") ? body.next : "/admin/trust";
  const res = NextResponse.json({ ok: true, next });
  res.cookies.set("admin_token", secret, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
