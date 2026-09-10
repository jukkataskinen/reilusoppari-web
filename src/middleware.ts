import { NextResponse, type NextRequest } from "next/server";
import { buildCsp } from "@/lib/security/csp";

/**
 * Generoi per-pyyntö CSP-noncen ja välittää sen sekä pyyntö- että
 * vastausotsakkeissa. Layout lukee noncen next/headers-headers()-kutsulla
 * ja antaa sen Plausible-skriptille (kohta 8).
 */
export function middleware(request: NextRequest) {
  const nonce = crypto.randomUUID().replace(/-/g, "");
  const cspHeader = buildCsp(nonce);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });
  response.headers.set("Content-Security-Policy", cspHeader);
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|fonts/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
