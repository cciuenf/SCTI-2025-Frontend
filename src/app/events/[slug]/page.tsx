import { cookies } from "next/headers";
import jwt from 'jsonwebtoken';
import { UserAccessTokenJwtPayload } from "@/types/auth-interfaces";
import ProductModalForm from "@/components/ProductModalForm";

interface EventPageProps {
  params: {
    slug: string;
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const cookieStore = cookies();
  const access_token = (await cookieStore).get("access_token")?.value;
  const user_info = jwt.decode(access_token as string) as UserAccessTokenJwtPayload | null;

  return (
    <div className="h-screen flex flex-col items-center font-spartan p-4">
      <h1 className="font-black text-2xl mb-6">Evento: {params.slug}</h1>
      <div className="w-full max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Informações do Evento</h2>
          <p className="mb-4">Slug atual: {params.slug}</p>
          <p className="mb-4">Usuário: {user_info?.name} {user_info?.last_name}</p>
        </div>
        <ProductModalForm />
      </div>
    </div>
  );
} 