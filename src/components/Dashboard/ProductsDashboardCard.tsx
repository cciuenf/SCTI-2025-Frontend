"use client";
import React from "react";
import { ScrollArea } from "../ui/scroll-area";
import {
  handleGetAllUserProducts,
  handleGetAllUserProductsPurchases,
} from "@/actions/product-actions";
import { useState, useEffect } from "react";
import {
  ProductPurchasesResponseI,
  ProductResponseI,
} from "@/types/product-interfaces";
import { convertNumberToBRL } from "@/lib/utils";
import ProductsDashboardListSkeleton from "./ProductsDashboardListSkeleton";

interface PurchaseWithProduct extends ProductPurchasesResponseI {
  product?: ProductResponseI;
}

const ProductsDashboardCard = () => {
  const [purchases, setPurchases] = useState<PurchaseWithProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const [purchasesRes, productsRes] = await Promise.all([
          handleGetAllUserProductsPurchases(),
          handleGetAllUserProducts(),
        ]);

        if (purchasesRes.success && productsRes.success) {
          const productsMap = new Map(
            productsRes.data.map((product) => [product.ID, product])
          );

          const purchasesWithProducts = purchasesRes.data.map((purchase) => ({
            ...purchase,
            product: productsMap.get(purchase.product_id),
          }));

          const filteredPurchases = purchasesWithProducts.filter(
            (purchase) => purchase.product && purchase.is_delivered
          );

          setPurchases(filteredPurchases);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-9/10 lg:w-1/3 min-h-72 flex flex-col items-center gap-3 rounded-md shadow-sm py-1">
      <h2 className="text-2xl font-bold">Meus Produtos</h2>
      {isLoading ? (
        <div className="w-full flex flex-col justify-around">
          <ProductsDashboardListSkeleton />
        </div>
      ) : (
        <ScrollArea className="w-full h-[260px] px-2">
          {purchases.length > 0 ? (
            purchases.map((p) => (
              <p
                key={p.id}
                className="w-full border-b-1 border-accent flex justify-between items-center text-xl mb-4"
              >
                {p.product?.name}
                <span className="text-accent text-xl">
                  {convertNumberToBRL(p.product!.price_int)}
                </span>
              </p>
            ))
          ) : (
            <div className="flex items-center justify-center">
              <p>Parece que você ainda não comprou nenhum produto!</p>
            </div>
          )}
        </ScrollArea>
      )}
    </div>
  );
};

export default ProductsDashboardCard;
