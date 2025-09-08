import { type NextRequest, NextResponse } from "next/server";
import { rateLimit } from "./middlewares/rate-limit";
import { auth } from "./middlewares/auth";
import { meta } from "./middlewares/meta";
import { logs } from "./middlewares/logs";

type MiddlewareFn = (
  req: NextRequest,
  res: NextResponse
) => NextResponse | Promise<NextResponse>;

function chain(middlewares: MiddlewareFn[]) {
  return async (req: NextRequest) => {
    const res = NextResponse.next();

    for (const mw of middlewares) {
      const result = await mw(req, res);
      if (result !== res) return result;
    }

    return res;
  };
}

export const config = {
  matcher:
    "/((?!api/log-ingest|api/rate-limit|_next/static|_next/image|favicon.ico).*)",
};

export default chain([rateLimit, auth, meta, logs]);
