import { cookies, headers } from 'next/headers';

export interface ServerClientInfoI {
  ip: string;
  userAgent: string;
  sessionId: string;
}

export async function getClientInfoFromHeaders(): Promise<ServerClientInfoI> {
  const h = await headers();
  const c = await cookies();
  return {
    sessionId: h.get("x-client-session") ?? c.get("client_session_id")?.value ?? "unknown",
    ip: h.get("x-client-ip") ?? "unknown",
    userAgent: h.get("x-client-user-agent") ?? "unknown",
  };
}