"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  handleGetAllUserProductsPurchases,
  handleGetAllUserProducts,
} from "@/actions/product-actions";
import type {
  ProductPurchasesResponseI,
  ProductResponseI,
} from "@/types/product-interfaces";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import UserPurchasesSkeleton from "./Profile/UserPurchasesSkeleton";
import { cn, convertNumberToBRL } from "@/lib/utils";

import {
  ShoppingCart,
  Gift,
  PackageCheck,
  Truck,
  CheckCircle2,
  ShoppingBag,
} from "lucide-react";
import { formatBR, safeTime } from "@/lib/date-utils";

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

          const purchasesWithProducts = (purchasesRes.data || []).map(
            (purchase) => ({
              ...purchase,
              product: productsMap.get(purchase.product_id),
            })
          );

          const filteredPurchases = purchasesWithProducts.filter(
            (purchase) => purchase.product
          );

          setPurchases(filteredPurchases);

          const overview = filteredPurchases.reduce(
            (acc, pur) => {
              if (pur.product) {
                acc.totalInPurchases += pur.product.price_int * pur.quantity;
                if (!pur.is_delivered && pur.product.is_physical_item) {
                  acc.pendentPurchases += 1;
                } else {
                  acc.finishedPurchases += 1;
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
        } else {
          setPurchases([]);
        }
      } catch (error) {
        toast.error("Ocorreu um erro ao carregar suas compras!");
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderHeader = () => {
    return (
      <header className="flex items-center justify-center gap-3">
        <ShoppingBag className="h-15 w-15 p-2 bg-zinc-100 rounded-2xl text-zinc-700" />
        <div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold">Minhas Compras</h2>
          <p className="text-sm text-zinc-600">Visualize todas as suas transações</p>
        </div>
      </header>
    )
  }

  if(loading) return (
    <div className="w-full max-w-6xl mx-auto mt-6 overflow-y-auto scrollbar-unvisible">
      {renderHeader()}
      <UserPurchasesSkeleton />
    </div>
  )

  if (purchases.length === 0) {
    return (
      <section className="w-full max-w-6xl mx-auto mt-6 overflow-y-auto scrollbar-unvisible">
        {renderHeader()}
        <div className="mt-12 flex flex-col items-center justify-center gap-4 text-center">
          <ShoppingCart className="h-12 w-12 text-zinc-400" />
          <p className="text-lg text-zinc-600">Você ainda não realizou nenhuma compra.</p>
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
      </section>
    );
  }

  const renderStatus = (p: PurchaseWithProduct) => {
    const isPhysical = !!p.product?.is_physical_item;
    if (isPhysical && p.is_delivered) {
      return (
        <Badge variant="default" className="gap-1">
          <PackageCheck className="h-3.5 w-3.5" />
          Entregue
        </Badge>
      );
    }
    if (isPhysical && !p.is_delivered) {
      return (
        <Badge variant="secondary" className="gap-1 text-white">
          <Truck className="h-3.5 w-3.5" />
            Pendente
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="gap-1">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Finalizado
      </Badge>
    );
  };

  return (
    <section className="w-full h-screen max-w-6xl mx-auto mt-6 pb-24 overflow-y-auto scrollbar-unvisible">
      {renderHeader()}
      <div className="relative w-full mt-6 overflow-x-auto shadow-sm rounded-lg">
        <Table className="min-w-[720px]">
          <TableHeader>
            <TableRow className="hover:bg-transparent sticky top-0 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
              <TableHead className="w-[36%]">Produto</TableHead>
              <TableHead className="w-[8%]">Qtd</TableHead>
              <TableHead className="w-[16%]">Valor</TableHead>
              <TableHead className="w-[20%]">Data de Compra</TableHead>
              <TableHead className="w-[12%]">Presenteou</TableHead>
              <TableHead className="w-[12%]">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {purchases.map((p) => {
              return (
                <TableRow
                  key={p.id}
                  className="odd:bg-muted/30 hover:bg-muted/60 transition-colors"
                >
                  <TableCell className="max-w-[380px]">
                    <div className="line-clamp-2 font-medium">
                      {p.product?.name ?? "Produto indisponível"}
                    </div>
                    {/* Subinfo opcional */}
                    {p.product?.price_int ? (
                      <div className="text-xs text-muted-foreground">
                        Unitário: {convertNumberToBRL(p.product.price_int)} •
                        {" "}Total:{" "}
                        {convertNumberToBRL(
                          (p.product.price_int || 0) * p.quantity
                        )}
                      </div>
                    ) : null}
                  </TableCell>

                  <TableCell>{p.quantity}</TableCell>

                  <TableCell className="font-medium">
                    {p.product ? convertNumberToBRL(p.product.price_int) : "—"}
                  </TableCell>

                  <TableCell>
                    {formatBR(safeTime(p.purchased_at))}
                  </TableCell>

                  <TableCell className="whitespace-nowrap">
                    {p.is_gift ? (
                      <span className="inline-flex items-center gap-1">
                        <Gift className="h-4 w-4" />
                        <span className="truncate max-w-[160px]">
                          {p.gifted_to_email}
                        </span>
                      </span>
                    ) : (
                      "—"
                    )}
                  </TableCell>

                  <TableCell>{renderStatus(p)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Overview */}
      <div className="w-full flex justify-center items-center flex-wrap gap-3 mt-6">
        <div className="w-64  rounded-xl border bg-card shadow-sm p-4 text-center">
          <h2 className="text-xl font-semibold">{overviewData.finishedPurchases}</h2>
          <p className="text-muted-foreground text-sm">Compras finalizadas</p>
        </div>

        <div className="w-64 rounded-xl border bg-card shadow-sm p-4 text-center">
          <h2 className="text-xl font-semibold text-accent">
            {convertNumberToBRL(overviewData.totalInPurchases)}
          </h2>
          <p className="text-muted-foreground text-sm">Total gasto</p>
        </div>

        <div className="w-64 rounded-xl border bg-card shadow-sm p-4 text-center">
          <h2 className="text-xl font-semibold">{overviewData.pendentPurchases}</h2>
          <p className="text-muted-foreground text-sm">Compras não entregues</p>
        </div>
      </div>
    </section>
  );
}
