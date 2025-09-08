import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (body.rateLimit == "true") {
      logger.warn(body, "[POST] RATE LIMIT REACHED");
      return NextResponse.json({ status: "ok" });
    }
    logger.info(body, "[POST REQUEST]");
    return NextResponse.json({ status: "ok" });
  } catch (error) {
    logger.error(error, "[POST ERROR]");
    return NextResponse.json(
      { error: "Erro ao processar a requisição." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const params = Object.fromEntries(searchParams.entries());

  logger.info({ params }, "[GET REQUEST]");

  return NextResponse.json({ status: "ok" });
}
