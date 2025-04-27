// import { handleVerifyTokens } from "@/actions/auth-actions";
import { NextRequest, NextResponse } from "next/server";
import { clearAuthTokens, getAuthTokens } from "./lib/cookies";
// import jwt from "jsonwebtoken";
// import { UserAccessTokenJwtPayload } from "./types/auth-interfaces";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const { accessToken, refreshToken } = await getAuthTokens();
  // const user_info = jwt.decode(accessToken as string) as UserAccessTokenJwtPayload | null
  if(!accessToken || !refreshToken) return NextResponse.redirect(new URL('/login', request.url));
  // try {
  //   const firstVerify = await handleVerifyTokens();
  //   if(firstVerify.status === 200) return response;
  // } catch (error) {
  //   clearAuthTokens();
  //   return NextResponse.redirect(new URL('/login', request.url));
  // }
  // return NextResponse.redirect(new URL('/login', request.url));
  return response;
}
  
export const config = {
  matcher: [
    '/dashboard/:path*',
  ],
}  