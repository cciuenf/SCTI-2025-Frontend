import { NextResponse, type NextRequest } from "next/server";

function isProtectedRoute(pathname: string): boolean {
  const protectedPaths = ["/dashboard", "/events", "/profile"];
  return protectedPaths.some(path => pathname.startsWith(path));
}

export async function auth(req: NextRequest, res: NextResponse) {
  if (!isProtectedRoute(req.nextUrl.pathname)) return res;
  
  const accessToken = req.cookies.get("access_token")?.value;
  const refreshToken = req.cookies.get("refresh_token")?.value;
  if (!accessToken || !refreshToken) {
    const redirect = NextResponse.redirect(new URL("/", req.url));
    redirect.cookies.delete("access_token");
    redirect.cookies.delete("refresh_token");
    return redirect;
  }

  return res;
}
