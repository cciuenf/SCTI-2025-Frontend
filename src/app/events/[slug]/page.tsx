import { cookies } from "next/headers";
import jwt from 'jsonwebtoken';
import { UserAccessTokenJwtPayload } from "@/types/auth-interfaces";
import ProductModalForm from "@/components/Products/ProductModalForm";
import { handleDeleteProduct, handleGetAllEventProducts } from "@/actions/product-actions";
import { convertNumberToBRL } from "@/lib/utils";
import ProductHandle from "@/components/Products/ProductHandle";

interface EventPageProps { params: { slug: string; } }

export default async function EventPage({ params }: EventPageProps) {
  const cookieStore = cookies();
  const access_token = (await cookieStore).get("access_token")?.value;
  const user_info = jwt.decode(access_token as string) as UserAccessTokenJwtPayload | null;
  const paramsW = await params;
  const products = (await handleGetAllEventProducts(paramsW.slug)).data;

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
        {products && products.map((product) => (
          <div key={product.name} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-bold mb-2">{product.name}</h3>
            <div className="space-y-2 text-gray-600">
              <p><span className="font-semibold">Preço:</span> {convertNumberToBRL(product.price_int)}</p>
              <p><span className="font-semibold">Quantidade:</span> {product.quantity}</p>
              <p><span className="font-semibold">Item Físico:</span> {product.is_physical_item ? 'Sim' : 'Não'}</p>
              <p><span className="font-semibold">Público:</span> {product.is_public ? 'Sim' : 'Não'}</p>
              <p><span className="font-semibold">Bloqueado:</span> {product.is_blocked ? 'Sim' : 'Não'}</p>
              <p><span className="font-semibold">Oculto:</span> {product.is_hidden ? 'Sim' : 'Não'}</p>
              <p><span className="font-semibold">Tipo de Ingresso:</span> {product.is_ticket_type ? 'Sim' : 'Não'}</p>
              {product.access_targets.length > 0 && (
                <div>
                  <p className="font-semibold">Alvos de Acesso:</p>
                  <ul className="list-disc list-inside">
                    {product.access_targets.map((target, index) => (
                      <li key={index}>
                        {target.is_event ? 'Evento' : 'Outro'} - ID: {target.target_id}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <ProductHandle product={product} slug={paramsW.slug}/>
          </div>
        ))}
      </div>
    </div>
  );
} 