import RefreshTokenList from "@/components/RefreshTokensList";
import { cookies } from "next/headers";
import jwt from 'jsonwebtoken';
import { UserAccessTokenJwtPayload } from "@/types/auth-interfaces";
import Link from "next/link";

export default async function Dashboard() {
  const cookieStore = cookies();
  const access_token = (await cookieStore).get("access_token")?.value;
  const user_info = jwt.decode(access_token as string) as UserAccessTokenJwtPayload | null;
  const refresh_token = (await cookieStore).get("refresh_token")?.value;

  const events = [
    { slug: "SCTI", name: "Computação" },
    { slug: "teste", name: "Teste" },
  ];

  return (
    <div className="h-screen flex flex-col items-center font-spartan p-4">
      <h1 className="font-black text-lg mb-3.5">Nome: {user_info?.name} {user_info?.last_name}</h1>
      <h1 className="font-black text-lg mb-3.5">Email: {user_info?.email}</h1>
      <h1 className="font-black text-lg mb-3.5">Usuário Verificado: {user_info?.is_verified ? "Sim" : "Não"}</h1>
      <h1 className="font-black text-lg mb-3.5">
        Tipo de Admin: {user_info?.is_super ? "Super" : user_info?.is_event_creator ? "Criador de Evento"  : "Não é admin"}
      </h1>

      <div className="w-full max-w-4xl mt-6">
        <h2 className="font-black text-xl mb-4">Eventos Disponíveis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => (
            <Link 
              href={`/events/${event.slug}`} 
              key={event.slug}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-lg">{event.name}</h3>
              <p className="text-gray-600">Slug: {event.slug}</p>
            </Link>
          ))}
        </div>
      </div>

      <h1 className="font-black text-lg mt-6 mb-3.5">Meus Tokens:</h1>
      <p className="max-w-lvw p-2 break-words">
        Access Token: {access_token ?? ""}
      </p>
      <p className="max-w-lvw p-2 break-words">
        Refresh Token: {refresh_token ?? ""}
      </p>
      <h1 className="font-black text-lg mt-3.5 mb-3.5">Refresh Tokens:</h1>
      <RefreshTokenList />
    </div>
  );
}
