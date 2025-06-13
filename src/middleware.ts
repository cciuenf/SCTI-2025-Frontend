import { handleVerifyTokens } from "@/actions/auth-actions";
import { NextRequest, NextResponse } from "next/server";
import { clearAuthTokens, getAuthTokens } from "./lib/cookies";
import { isAccessTokenExpired } from "./lib/utils";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const { accessToken, refreshToken } = await getAuthTokens();
  if(!accessToken || !refreshToken) {
    await clearAuthTokens();
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  if(isAccessTokenExpired(accessToken)) return response;

  try {
    const firstVerify = await handleVerifyTokens();
    if(firstVerify.status === 200) return response;
    await clearAuthTokens();
  } catch (error) {
    await clearAuthTokens();
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.redirect(new URL('/login', request.url));
}
  
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/events/:path*',
  ],
}  