'use client';

import { handleGetAllUserProducts } from '@/actions/product-actions';
import { convertNumberToBRL } from '@/lib/utils';
import { ProductResponseI } from '@/types/product-interfaces';
import { useEffect, useState } from 'react';

export default function UserProducts() {
  const [products, setProducts] = useState<ProductResponseI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await handleGetAllUserProducts();
        if (res.success) setProducts(res.data);
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div>Carregando produtos...</div>;

  return (
    <div className="w-full max-w-4xl mt-6">
      <h2 className="font-black text-xl mb-4">Meus Produtos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div 
            key={product.ID}
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
          >
            <h3 className="font-bold text-lg">{product.name}</h3>
            <p className="text-gray-600">{product.description}</p>
            <p className="text-green-600 font-semibold mt-2">
              {convertNumberToBRL(product.price_int)}
            </p>
            <div className="mt-2 text-sm text-gray-500">
              <p>Quantidade disponível: {product.quantity}</p>
              {product.is_physical_item && <p>Item físico</p>}
              {product.is_ticket_type && <p>Ingresso</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 