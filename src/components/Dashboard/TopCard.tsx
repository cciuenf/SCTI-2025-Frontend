"use client";
import {
  handleGetAllUserProducts,
  handleGetAllUserProductsPurchases,
} from "@/actions/product-actions";
import { convertNumberToBRL } from "@/lib/utils";
import React, { useEffect, useState } from "react";

type Props = {
  type: "amount" | "user" | "spent";
  data?: { label: string; content: string | undefined };
};

const TopCard = ({ type, data }: Props) => {
  const [totalSpent, setTotalSpent] = useState<number>(0.0);

  if (type == "spent") {
    useEffect(() => {
      const getUserTotalSpent = async () => {
        const [products, purchases] = await Promise.all([
          handleGetAllUserProducts(),
          handleGetAllUserProductsPurchases(),
        ]);
        const initialValue: number = 0.0;

        if (products.success && purchases.success) {
          const productsMap = new Map(products.data.map((p) => [p.ID, p]));

          const purchasesWithProducts = purchases.data.map((p) => ({
            ...p,
            product: productsMap.get(p.product_id),
          }));

          const total: number = purchasesWithProducts.reduce((acc, p) => {
            if (p.is_delivered && p.product) {
              acc = acc + p.product?.price_int;
            }

            return acc;
          }, initialValue);

          setTotalSpent(total);
        }
      };

      getUserTotalSpent();
    }, []);
  }

  if (type == "amount") {
    return (
      <>
        <div className="w-2/5 lg:w-3/10 flex flex-col justify-between items-start shadow-sm rounded-md px-3 py-2 min-h-28">
          <h2 className="text-base sm:text-2xl font-bold">{data?.label}</h2>
          <h2 className="text-xl text-accent sm:text-3xl">{data?.content}</h2>
        </div>
      </>
    );
  }

  if (type == "spent") {
    return (
      <>
        <div className="w-2/5 lg:w-3/10 flex flex-col justify-between items-start shadow-sm rounded-md px-3 py-2 min-h-28">
          <h2 className="text-base sm:text-2xl font-bold">Total gasto</h2>
          <h2 className="text-xl text-accent sm:text-3xl">
            {convertNumberToBRL(totalSpent)}
          </h2>
        </div>
      </>
    );
  }

  return (
    <div className="w-4/5 lg:w-1/3 flex flex-col justify-between items-start shadow-sm rounded-md px-3 py-2 min-h-28">
      <h2 className="text-base sm:text-2xl font-bold">{data?.label}</h2>
      <h2 className="text-base sm:text-xl">{data?.content}</h2>
    </div>
  );
};

export default TopCard;
