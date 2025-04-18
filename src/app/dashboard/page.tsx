import { handleGetRefreshTokens } from "@/actions/auth-actions";
import RefreshTokenList from "@/components/RefreshTokensList";
import { cookies } from "next/headers";
import jwt from 'jsonwebtoken';
import { UserAccessTokenJwtPayload } from "@/types/authI";

export default async function Dashboard() {
  const cookieStore = cookies() as ReturnType<typeof cookies>;
  const access_token = (await cookieStore).get("access_token")?.value;
  const user_info = jwt.decode(access_token as string) as UserAccessTokenJwtPayload | null
  const refresh_token = (await cookieStore).get("refresh_token")?.value;

  const refreshTokens = await handleGetRefreshTokens();
  const tokens = refreshTokens[0];
  return (
    <div className="h-screen flex flex-col items-center font-mono p-4">
      <h1 className="font-black text-lg mb-3.5">Nome: {user_info?.name} {user_info?.last_name}</h1>
      <h1 className="font-black text-lg mb-3.5">Email: {user_info?.email}</h1>
      <h1 className="font-black text-lg mb-3.5">Tipo de Admin: {user_info?.admin_type}</h1>
      <h1 className="font-black text-lg mb-3.5">Meus Tokens:</h1>
      <p className="max-w-lvw p-2 break-words">
        Access Token: {access_token ?? ""}
      </p>
      <p className="max-w-lvw p-2 break-words">
        Refresh Token: {refresh_token ?? ""}
      </p>
      <h1 className="font-black text-lg mt-3.5 mb-3.5">Refresh Tokens:</h1>
      {tokens && <RefreshTokenList tokens={tokens} />}
    </div>
  );
}
