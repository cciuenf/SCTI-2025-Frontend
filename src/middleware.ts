import { type NextRequest, NextResponse } from "next/server";
import { clearAuthTokens, getAuthTokens } from "./lib/cookies";

export async function middleware(request: NextRequest) {
  const clientIP = getClientIP(request);
  const userAgent = request.headers.get('user-agent') || 'Unknown';

  const response = NextResponse.next();

  response.headers.set('x-client-ip', clientIP);
  response.headers.set('x-client-user-agent', userAgent);

  if(isProtectedRoute(request.nextUrl.pathname)) {
    const { accessToken, refreshToken } = await getAuthTokens();
    if(!accessToken || !refreshToken) {
      await clearAuthTokens();
      return NextResponse.redirect(new URL('/', request.url));
    }
    return response;
  }
  return response;
}
  
export const config = { matcher: ["/:path*"] }  

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  
  if (forwarded) return forwarded.split(',')[0].trim();
  if (realIp) return realIp.trim();
  if (cfConnectingIp)  return cfConnectingIp.trim();

  return request.headers.get('x-forwarded-for') || request.headers.get('remote-addr') || '127.0.0.1';
}


function isProtectedRoute(pathname: string): boolean {
  const protectedPaths = [
    '/dashboard',
    '/events',
    '/profile',
  ];
  return protectedPaths.some(path => pathname.startsWith(path));
}