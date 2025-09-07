import { NextResponse, type NextRequest } from "next/server";

function isPageRefresh(req: NextRequest) {
  const mode = req.headers.get("sec-fetch-mode");
  const dest = req.headers.get("sec-fetch-dest");
  const accept = req.headers.get("accept") || "";
  return req.method === "GET" && (
    (mode === "navigate" && dest === "document") ||
    accept.includes("text/html")
  );
}

export async function rateLimit(req: NextRequest, res: NextResponse) {
  const isLinkNav = req.headers.has("next-url");
  const isRefresh = isPageRefresh(req);
  if (!isLinkNav && !isRefresh) return res;

  const checkUrl = new URL("/api/rate-check", req.nextUrl.origin);
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