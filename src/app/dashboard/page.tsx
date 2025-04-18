import { cookies } from "next/headers";

export default async function Dashboard() {
  const cookieStore = cookies() as ReturnType<typeof cookies>;
  const access_token = (await cookieStore).get("access_token")?.value;
  const refresh_token = (await cookieStore).get("refresh_token")?.value;
  return (
    <div className="h-screen flex flex-col items-center font-mono p-4">
      <h1 className="font-black text-lg mb-3.5">Meus Tokens:</h1>
      <p className="max-w-lvw p-2 break-words">
        Access Token: {access_token ?? ""}
      </p>
      <p className="max-w-lvw p-2 break-words">
        Refresh Token: {refresh_token ?? ""}
      </p>
    </div>
  );
}
