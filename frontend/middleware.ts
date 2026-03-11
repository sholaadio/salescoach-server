import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Routes that require no auth
const PUBLIC_PATHS = ["/login"]

// Role-to-portal mapping
const ROLE_PORTALS: Record<string, string> = {
  ceo: "/management",
  gm: "/management",
  head_sales: "/management",
  head_creative: "/management",
  hr: "/management",
  teamlead: "/team-lead",
  closer: "/dashboard",
}

// Which portal prefix each role is allowed on
const ALLOWED_PREFIX: Record<string, string[]> = {
  ceo: ["/management"],
  gm: ["/management"],
  head_sales: ["/management"],
  head_creative: ["/management"],
  hr: ["/management"],
  teamlead: ["/team-lead"],
  closer: ["/dashboard"],
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Always allow public paths and Next.js internals
  if (
    PUBLIC_PATHS.some((p) => pathname.startsWith(p)) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next()
  }

  // Redirect root to login
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Read session from cookie (set by login page)
  const sessionCookie = request.cookies.get("sc_session")
  if (!sessionCookie?.value) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  let session: { role?: string } = {}
  try {
    session = JSON.parse(sessionCookie.value)
  } catch {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  const role = session.role
  if (!role || !ROLE_PORTALS[role]) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Check the user is accessing the right portal
  const allowed = ALLOWED_PREFIX[role] ?? []
  const hasAccess = allowed.some((prefix) => pathname.startsWith(prefix))
  if (!hasAccess) {
    return NextResponse.redirect(new URL(ROLE_PORTALS[role], request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all paths except static files
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
