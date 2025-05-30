import { cookies } from "next/headers";
import jwt from 'jsonwebtoken';
import { UserAccessTokenJwtPayload } from "@/types/auth-interfaces";
import ProductModalForm from "@/components/Products/ProductModalForm";
import ProductsList from "@/components/Products/ProductsList";

interface EventPageProps { params: { slug: string; } }

export default async function EventPage({ params }: EventPageProps) {
  const cookieStore = cookies();
  const access_token = (await cookieStore).get("access_token")?.value;
  const user_info = jwt.decode(access_token as string) as UserAccessTokenJwtPayload | null;
  const paramsW = await params;

  return (
    <div className="h-screen flex flex-col items-center font-spartan p-4">
      <h1 className="font-black text-2xl mb-6">Evento: {paramsW.slug}</h1>
      <div className="w-full max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Informações do Evento</h2>
          <p className="mb-4">Slug atual: {paramsW.slug}</p>
          <p className="mb-4">Usuário: {user_info?.name} {user_info?.last_name}</p>
        </div>
        <ProductModalForm slug={paramsW.slug} isCreating={true}/>
      </div>
      <h1 className="font-black text-2xl mb-6 mt-2">Produtos:</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-7xl">
        <ProductsList slug={paramsW.slug} />
      </div>
    </div>
  );
} 