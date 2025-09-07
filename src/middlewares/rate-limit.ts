import { NextResponse, type NextRequest } from "next/server";

const IMAGE_EXT_RE = /\.(?:avif|webp|png|jpe?g|gif|svg|ico)$/i;
const SKIP_PREFIXES = ["/_next", "/static", "/favicon", "/robots.txt", "/sitemap.xml", "/images"];
const RATE_CHECK_PATH = "/api/rate-check";

function isImageRequest(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (SKIP_PREFIXES.some(p => pathname.startsWith(p))) return true;
  if (pathname.startsWith("/_next/image")) return true;

  const dest = req.headers.get("sec-fetch-dest");
  if (dest === "image") return true;

  if (IMAGE_EXT_RE.test(pathname)) return true;

  return false;
}

function shouldBypass(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === RATE_CHECK_PATH) return true;
  if (req.headers.get("x-internal-ratecheck") === "1") return true;
  if (req.headers.get("x-middleware-subrequest") === "1") return true;
  if (isImageRequest(req)) return true;
  return false;
}

export async function rateLimit(req: NextRequest, res: NextResponse) {
  if (shouldBypass(req)) return res

  const checkUrl = new URL(RATE_CHECK_PATH, req.nextUrl.origin);
  const checkRes = await fetch(checkUrl, {
    method: "GET",
    headers: {
      "x-forwarded-for": req.headers.get("x-forwarded-for") ?? "",
      "x-internal-ratecheck": "1",
    },
    cache: "no-store",
  });

  const limited = checkRes.headers.get("x-ratelimit-limited") ?? "";
  const remaining = checkRes.headers.get("x-ratelimit-remaining") ?? "";
  const reset = checkRes.headers.get("x-ratelimit-reset") ?? "";
  const current = checkRes.headers.get("x-ratelimit-current") ?? "";

  res.headers.set("x-ratelimit-limited", limited);
  res.headers.set("x-ratelimit-remaining", remaining);
  res.headers.set("x-ratelimit-reset", reset);
  res.headers.set("x-ratelimit-current", current);
  
  if (checkRes.status === 429) 
    return new NextResponse("Too Many Requests", { status: 429, headers: res.headers });
  
  return res;
}