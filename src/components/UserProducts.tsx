'use client';

import { handleGetAllUserProducts } from '@/actions/product-actions';
import { runWithToast } from '@/lib/client/run-with-toast';
import type { ProductResponseI } from '@/types/product-interfaces';
import { useEffect, useState } from 'react';
import ProductCard from './Products/ProductCard';

export default function UserProducts() {
  const [products, setProducts] = useState<ProductResponseI[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      const res = await runWithToast(
        handleGetAllUserProducts(),
        {
          loading: 'Carregando produtos...',
          success: () => 'Produtos carregados com sucesso!',
          error: () => 'Erro ao carregar produtos.',
        }
      );
      if (res.success && res.data) setProducts(res.data);
      setIsLoading(false);
    };

    fetchProducts();
  }, []);

  if (isLoading) return <div>Carregando produtos...</div>;

  return (
    <div className="grid justify-center md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <ProductCard key={product.ID} data={product} isEventCreator={false} />  
      ))}
    </div>
  );
} 