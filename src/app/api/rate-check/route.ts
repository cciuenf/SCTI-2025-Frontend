import { NextResponse } from "next/server";
import { checkRateLimit } from "../_utils/rate-limit";

export async function GET(req: Request) {
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0]?.trim();

  console.log("IP: " + ip)
  const { limited, remaining, resetAt, current } = await checkRateLimit(ip);
  console.log(remaining)
  const headers = new Headers({
    "x-ratelimit-limit": String(limited),
    "x-ratelimit-remaining": String(remaining),
    "x-ratelimit-reset": String(resetAt),
    "x-ratelimit-current": String(current),
  });

  if (limited) {
    return new NextResponse("Too Many Requests", {
      status: 429,
      headers,
    });
  }

  return new NextResponse("OK", { status: 200, headers });
}
