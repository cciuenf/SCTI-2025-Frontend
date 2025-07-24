"use client";

import {
  handleGetAllUserProductsPurchases,
  handleGetAllUserProducts,
} from "@/actions/product-actions";
import { format } from "date-fns";
import {
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
          handleGetAllUserProducts(),
        ]);

        if (purchasesRes.success && productsRes.success) {
          const productsMap = new Map(
            productsRes.data.map((product) => [product.ID, product])
          );

          // Match purchases with their corresponding products
          const purchasesWithProducts = purchasesRes.data.map((purchase) => ({
            ...purchase,
            product: productsMap.get(purchase.product_id),
          }));

          const filteredPurchases = purchasesWithProducts.filter(
            (purchase) => purchase.product
          );

          setPurchases(filteredPurchases);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Carregando compras...</div>;

  return (
    <>
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
              <TableCell>{`${p.product?.price_int}R$`}</TableCell>
              <TableCell>{format(p.purchased_at, "dd/MM/yyyy")}</TableCell>
              <TableCell>{p.is_gift ? p.gifted_to_email : `X`} </TableCell>
              <TableCell>{p.is_delivered ? `Pago` : `Pendente`} </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
