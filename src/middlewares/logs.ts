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
    ip_address: res.headers.get("x-client-ip"),
    user_agent: res.headers.get("x-client-user-agent"),
    duration_ms: Date.now() - startTime,
    rate_limit: res.headers.get("x-ratelimit-limited"),
  };

  fetch(`${req.nextUrl.origin}/api/log-ingest`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(logPayload),
  });

  return res;
}
