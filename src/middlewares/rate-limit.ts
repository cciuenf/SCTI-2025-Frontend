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
  if (shouldBypass(req)) return NextResponse.next();

  const checkUrl = new URL(RATE_CHECK_PATH, req.nextUrl.origin);
  const checkRes = await fetch(checkUrl, {
    method: "GET",
    headers: {
      "x-forwarded-for": req.headers.get("x-forwarded-for") ?? "",
    },
    cache: "no-store",
  });

  const nextHeaders = new Headers({
    "x-ratelimit-limit": checkRes.headers.get("x-ratelimit-limit") ?? "",
    "x-ratelimit-remaining": checkRes.headers.get("x-ratelimit-remaining") ?? "",
    "x-ratelimit-reset": checkRes.headers.get("x-ratelimit-reset") ?? "",
  });

  if (checkRes.status === 429) {
    return new NextResponse("Too Many Requests", {
      status: 429,
      headers: nextHeaders,
    });
  }
  return res;
}