import { NextResponse } from "next/server";
import { checkRateLimit } from "../_utils/rate-limit";

export const runtime = "nodejs";

function getIp(req: Request) {
  const h = (name: string) => req.headers.get(name) || "";
  return (
    h("x-forwarded-for").split(",")[0].trim() ||
    h("x-real-ip") ||
    h("cf-connecting-ip") ||
    h("remote-addr") ||
    "0.0.0.0"
  );
}

export async function GET(req: Request) {
  const ip = getIp(req);

  const { limited, remaining, resetAt, current } = await checkRateLimit(ip);
  const headers = new Headers({
    "x-ratelimit-limited": String(limited),
    "x-ratelimit-remaining": String(remaining),
    "x-ratelimit-reset": String(resetAt),
    "x-ratelimit-current": String(current),
  });

  if (limited) return new NextResponse("Too Many Requests", { status: 429, headers });
  return new NextResponse("OK", { status: 200, headers });
}
