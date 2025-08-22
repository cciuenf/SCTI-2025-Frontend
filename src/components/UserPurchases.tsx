"use client";

import {
  handleGetAllUserProductsPurchases,
  handleGetAllUserProducts,
} from "@/actions/product-actions";
import { format } from "date-fns";
import type {
  ProductPurchasesResponseI,
  ProductResponseI,
} from "@/types/product-interfaces";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { convertNumberToBRL } from "@/lib/utils";
import UserPurchasesSkeleton from "./Profile/UserPurchasesSkeleton";
import { toast } from "sonner";

interface PurchaseWithProduct extends ProductPurchasesResponseI {
  product?: ProductResponseI;
}

export default function UserPurchases() {
  const [purchases, setPurchases] = useState<PurchaseWithProduct[]>([]);
  const [overviewData, setOverviewData] = useState<{
    finishedPurchases: number;
    totalInPurchases: number;
    pendentPurchases: number;
  }>({
    finishedPurchases: 0,
    totalInPurchases: 0.0,
    pendentPurchases: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [purchasesRes, productsRes] = await Promise.all([
          handleGetAllUserProductsPurchases(),
          handleGetAllUserProducts(),
        ]);

        if (purchasesRes.success && productsRes.success) {
          const productsMap = new Map(
            (productsRes.data || []).map((product) => [product.ID, product])
          );

          const purchasesWithProducts = (purchasesRes.data || []).map((purchase) => ({
            ...purchase,
            product: productsMap.get(purchase.product_id),
          }));

          const filteredPurchases = purchasesWithProducts.filter(
            (purchase) => purchase.product
          );

          setPurchases(filteredPurchases);

          const overview = filteredPurchases.reduce(
            (acc, pur) => {
              if (pur.product) {
                if (pur.is_delivered) {
                  acc.totalInPurchases += pur.product.price_int;
                  acc.finishedPurchases += 1;
                } else {
                  acc.pendentPurchases += 1;
                }
              }
              return acc;
            },
            {
              finishedPurchases: 0,
              totalInPurchases: 0.0,
              pendentPurchases: 0,
            }
          );
          setOverviewData(overview);
          toast.success("Compras carregadas com sucesso!");
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error("Erro ao carregar compras do usuário.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <UserPurchasesSkeleton />;

  if (purchases.length == 0)
    return (
      <p>Parece que você ainda não adquiriu nenhum de nossos produtos :/</p>
    );

  return (
    <div className="w-8/10">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Produto</TableHead>
            <TableHead>Quantidade</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Data de Compra</TableHead>
            <TableHead>Presenteou</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {purchases.map((p) => (
            <TableRow key={p.id}>
              <TableCell>{p.product?.name} </TableCell>
              <TableCell>{p.quantity}</TableCell>
              <TableCell>
                {p.product ? `${convertNumberToBRL(p.product?.price_int)}` : ``}
              </TableCell>
              <TableCell>
                {format(p.purchased_at, "dd/MM/yyyy HH:mm")}
              </TableCell>
              <TableCell>{p.is_gift ? p.gifted_to_email : `X`} </TableCell>
              <TableCell>{p.is_delivered ? `Entregue` : `Pendente`} </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="w-full flex flex-col sm:flex-row justify-around items-center mt-5 gap-3">
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-xl">{overviewData.finishedPurchases}</h2>
          <h3 className="text-zinc-900/70 text-sm sm:text-base">
            Compras finalizadas
          </h3>
        </div>
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-xl text-accent">
            {convertNumberToBRL(overviewData.totalInPurchases)}
          </h2>
          <h3 className="text-zinc-900/70 text-sm sm:text-base">Total gasto</h3>
        </div>
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-xl">{overviewData.pendentPurchases}</h2>
          <h3 className="text-zinc-900/70 text-sm sm:text-base">
            Compras pendentes
          </h3>
        </div>
      </div>
    </div>
  );
}
