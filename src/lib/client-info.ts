import { headers } from 'next/headers';

export interface ServerClientInfoI {
  ip: string;
  userAgent: string;
}

export async function getClientInfoFromHeaders(): Promise<ServerClientInfoI> {
  const headersList = await headers();
  
  return {
    ip: headersList.get('x-client-ip') || 'unknown',
    userAgent: headersList.get('x-client-user-agent') || 'unknown',
  };
}