import { handleVerifyTokens } from "@/actions/auth-actions";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
    // X-New-Access-Token
    // X-New-Refresh-Token
    const response = NextResponse.next();
    const firstVerify = await handleVerifyTokens();
    if(firstVerify.status === 200) return response;
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
export const config = {
  matcher: [
    '/dashboard/:path*',
  ],
}  