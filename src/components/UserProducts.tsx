'use client';

import { handleGetAllUserProducts, handleGetAllUserProductsRelation } from '@/actions/product-actions';
import type { ProductResponseI, UserProductPurchasesResponseI } from '@/types/product-interfaces';
import { useEffect, useMemo, useState } from 'react';
import CardSkeleton from './Loading/CardSkeleton';
import { ShoppingCart, } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import OwnedProductCard from './Products/OwnedProductCard';

export default function UserProducts() {
  const [products, setProducts] = useState<ProductResponseI[]>([]);
  const [relations, setRelations] = useState<UserProductPurchasesResponseI[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const [resAllUserProducts, resUserProductsRelation] = await Promise.all([
        handleGetAllUserProducts(),
        handleGetAllUserProductsRelation(),
      ]);

      if (resAllUserProducts.success && resAllUserProducts.data) 
        setProducts(resAllUserProducts.data);
      if (resUserProductsRelation.success && resUserProductsRelation.data) 
        setRelations(resUserProductsRelation.data);

      setIsLoading(false);
    })();
  }, []);

  const qtyByProduct = useMemo(() => {
    const map = new Map<string, { total: number; gifted: number }>();
    for (const r of relations) {
      const cur = map.get(r.product_id) ?? { total: 0, gifted: 0 };
      cur.total += r.quantity ?? 0;
      if (r.received_as_gift) cur.gifted += r.quantity ?? 0;
      map.set(r.product_id, cur);
    }
    return map;
  }, [relations]);

  const userProducts = useMemo(() => {
    return products
      .map((p) => {
        const agg = qtyByProduct.get(p.ID);
        if (!agg && !p.has_unlimited_quantity) return null;
        const qty = agg?.total ?? 0;
        const gifted = agg?.gifted ?? 0;
        return qty > 0 ? { product: p, qty, gifted } : null;
      })
      .filter(Boolean) as { product: ProductResponseI; qty: number; gifted: number }[];
  }, [products, qtyByProduct]);
  if (isLoading) return <CardSkeleton count={6} />;

  if (userProducts.length === 0) {
    return (
      <div className="mt-6 flex flex-col items-center justify-center gap-4 text-center">
        <ShoppingCart className="h-12 w-12 text-zinc-400" />
        <p className="text-lg text-zinc-600">Você ainda não possui nenhum produto.</p>
        <Link
          href="/events/scti?view=products"
          className={cn(
            'h-10 px-4 rounded-md inline-flex items-center gap-2',
            'bg-accent text-white hover:opacity-90 transition-opacity'
          )}
        >
          <span>Adquirir produtos</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid px-2 justify-center gap-5 sm:grid-cols-2 lg:grid-cols-3 mt-5 mb-20 ">
      {userProducts.map(({ product, qty, gifted }) => (
        <OwnedProductCard
          key={product.ID}
          p={product}
          qty={qty}
          giftedCount={gifted}
        />
      ))}
    </div>
  );
}
