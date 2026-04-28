import { NextResponse } from "next/server";

function parseCookies(cookieHeader: string | null): Record<string, string> {
  if (!cookieHeader) return {};
  const out: Record<string, string> = {};
  for (const part of cookieHeader.split(";")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    const k = part.slice(0, idx).trim();
    const v = decodeURIComponent(part.slice(idx + 1).trim());
    out[k] = v;
  }
  return out;
}

/**
 * Returns an error NextResponse if not admin, or null if OK.
 * Accepts Bearer ADMIN_SECRET or httpOnly cookie `admin_token` (see login route).
 */
export function requireAdmin(request: Request): NextResponse | null {
  const secret = process.env.ADMIN_SECRET?.trim();

  // Dev without ADMIN_SECRET: allow local dashboard
  if (!secret || secret.length === 0) {
    if (process.env.NODE_ENV !== "production") return null;
    return NextResponse.json({ error: "Admin not configured" }, { status: 503 });
  }

  const auth = request.headers.get("authorization");
  if (auth === `Bearer ${secret}`) return null;

  const cookies = parseCookies(request.headers.get("cookie"));
  const token = cookies.admin_token;
  if (token === secret) return null;

  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
