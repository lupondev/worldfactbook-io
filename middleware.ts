import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) return NextResponse.next();
  if (pathname.startsWith("/admin/login")) return NextResponse.next();

  const secret = process.env.ADMIN_SECRET?.trim();
  if (!secret || secret.length === 0) {
    if (process.env.NODE_ENV !== "production") return NextResponse.next();
    return NextResponse.json({ error: "Admin not configured" }, { status: 503 });
  }

  const token = request.cookies.get("admin_token")?.value;
  if (token === secret) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = "/admin/login";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*"],
};
