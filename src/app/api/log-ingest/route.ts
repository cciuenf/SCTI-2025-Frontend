import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";

// Função que lida especificamente com requisições POST
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    logger.info(body, "Log de POST recebido do middleware");

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    logger.error(error, "Erro ao processar log-ingest POST");
    return NextResponse.json(
      { error: "Erro ao processar a requisição." },
      { status: 500 }
    );
  }
}

// Função que lida especificamente com requisições GET
export async function GET(req: NextRequest) {
  // Requisições GET não têm corpo (body).
  // Se você quiser logar parâmetros, pode pegá-los da URL.
  const { searchParams } = new URL(req.url);
  const params = Object.fromEntries(searchParams.entries());

  logger.info({ params }, "Log de GET recebido do middleware");

  return NextResponse.json({ status: "ok" });
}
