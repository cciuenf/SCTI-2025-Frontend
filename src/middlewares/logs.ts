import { NextResponse, type NextRequest } from "next/server";

export async function logs(
  req: NextRequest,
  res: NextResponse,
  startTime: number
) {
  const timestamp = new Date();

  const logPayload = {
    method: req.method,
    path: req.url,
    ip: res.headers.get("x-client-ip"),
    userAgent: res.headers.get("x-client-user-agent"),
    timestamp,
    rateLimit: res.headers.get("x-ratelimit-limited"),
    duration: `${Date.now() - startTime}ms`,
  };

  fetch(`${req.nextUrl.origin}/api/log-ingest`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(logPayload),
  });

  return res;
}
