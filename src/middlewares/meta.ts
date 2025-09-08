import type { NextResponse, NextRequest } from "next/server";

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const cfConnectingIp = request.headers.get("cf-connecting-ip");

  if (forwarded) return forwarded.split(",")[0].trim();
  if (realIp) return realIp.trim();
  if (cfConnectingIp) return cfConnectingIp.trim();

  return request.headers.get("remote-addr") || "127.0.0.1";
}

export function meta(req: NextRequest, res: NextResponse) {

  res.headers.set("x-client-ip", getClientIP(req));
  res.headers.set("x-client-user-agent", req.headers.get("user-agent") || "Unknown");

  return res;
}
