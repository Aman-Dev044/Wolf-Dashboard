import { NextResponse, type NextRequest } from "next/server";

/** Keeps old WordPress search links (/?s=term) working by sending them to the shop search. */
export function middleware(req: NextRequest) {
  const s = req.nextUrl.searchParams.get("s");
  if (req.nextUrl.pathname === "/" && s !== null) {
    const url = req.nextUrl.clone();
    url.pathname = "/shop/";
    url.search = s ? `?q=${encodeURIComponent(s)}` : "";
    return NextResponse.redirect(url, 301);
  }
  return NextResponse.next();
}

export const config = { matcher: "/" };
