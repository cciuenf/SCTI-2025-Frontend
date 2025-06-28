"use client"
import { ProductResponseI } from "@/types/product-interfaces";
import { ActivityResponseI } from "@/types/activity-interface";
import ProductHandle from "./ProductHandle";
import { convertNumberToBRL } from "@/lib/utils";

interface ProductsListI {
  products: ProductResponseI[];
  currentEvent: { id: string; slug: string }
  activities: ActivityResponseI[];
  onProductUpdate: (updatedProduct: ProductResponseI) => Promise<void>;
  onProductDelete: (productId: string) => Promise<void>;
}

export default function ProductsList({ products, currentEvent, activities, onProductUpdate, onProductDelete }: ProductsListI) {
  return (
    <>
      {products.map((product) => (
        <div key={product.ID} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
          <h3 className="text-xl font-bold mb-2">{product.name}</h3>
          <div className="space-y-2 text-gray-600">
            <p><span className="font-semibold">Preço:</span> {convertNumberToBRL(product.price_int)}</p>
            <p><span className="font-semibold">Quantidade:</span> {product.has_unlimited_quantity ? "Infinito" : product.quantity}</p>
            <p><span className="font-semibold">Item Físico:</span> {product.is_physical_item ? 'Sim' : 'Não'}</p>
            <p><span className="font-semibold">Público:</span> {product.is_public ? 'Sim' : 'Não'}</p>
            <p><span className="font-semibold">Bloqueado:</span> {product.is_blocked ? 'Sim' : 'Não'}</p>
            <p><span className="font-semibold">Oculto:</span> {product.is_hidden ? 'Sim' : 'Não'}</p>
            <p><span className="font-semibold">Ticket:</span> {product.is_ticket_type ? 'Sim' : 'Não'}</p>
            {product.access_targets?.length > 0 && (
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
          <ProductHandle 
            product={product} 
            currentEvent={currentEvent}
            activities={activities}
            onProductDelete={onProductDelete}
            onProductUpdate={onProductUpdate}
          />
        </div>
      ))}
    </>
  );
}
