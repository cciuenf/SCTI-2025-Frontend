'use client';

import { handleGetAllUserProductsPurchases, handleGetAllUserProducts } from '@/actions/product-actions';
import { convertNumberToBRL } from '@/lib/utils';
import { ProductPurchasesResponseI, ProductResponseI } from '@/types/product-interfaces';
import { useEffect, useState } from 'react';

interface PurchaseWithProduct extends ProductPurchasesResponseI {
  product?: ProductResponseI;
}

export default function UserPurchases() {
  const [purchases, setPurchases] = useState<PurchaseWithProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [purchasesRes, productsRes] = await Promise.all([
          handleGetAllUserProductsPurchases(),
          handleGetAllUserProducts()
        ]);

        if (purchasesRes.success && productsRes.success) {
          const productsMap = new Map(productsRes.data.map(product => [product.ID, product]));

          // Match purchases with their corresponding products
          const purchasesWithProducts = purchasesRes.data.map(purchase => ({
            ...purchase,
            product: productsMap.get(purchase.product_id)
          }));
          setPurchases(purchasesWithProducts);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Carregando compras...</div>;

  return (
    <div className="w-full max-w-4xl mt-6">
      <h2 className="font-black text-xl mb-4">Minhas Compras</h2>
      <div className="grid grid-cols-1 gap-4">
        {purchases.map((purchase) => (
          <div 
            key={purchase.id}
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">{purchase.product?.name || 'Produto não encontrado'}</h3>
                <p className="text-gray-600">{purchase.product?.description}</p>
              </div>
              <div className="text-right">
                <p className="text-green-600 font-semibold">
                  {purchase.product && convertNumberToBRL(purchase.product.price_int)}
                </p>
                <p className="text-sm text-gray-500">
                  Quantidade: {purchase.quantity}
                </p>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">
                    <span className="font-semibold">Data da compra:</span>{' '}
                    {new Date(purchase.purchased_at).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Status:</span>{' '}
                    {purchase.is_delivered ? 'Entregue' : 'Pendente'}
                  </p>
                </div>
                <div>
                  {purchase.is_gift && (
                    <p className="text-gray-600">
                      <span className="font-semibold">Presente para:</span>{' '}
                      {purchase.gifted_to_email}
                    </p>
                  )}
                  <p className="text-gray-600">
                    <span className="font-semibold">Tipo:</span>{' '}
                    {purchase.is_gift ? 'Presente' : 'Compra pessoal'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 