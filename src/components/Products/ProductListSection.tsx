"use client";

import { useState, useEffect, type Dispatch, type SetStateAction, useMemo } from "react";
import ProductModalForm from "./ProductModalForm";
import type {
  ProductPurchasesResponseI,
  ProductResponseI,
} from "@/types/product-interfaces";
import type { ActivityResponseI } from "@/types/activity-interface";
import {
  handleDeleteProduct,
  handleGetAllEventProducts,
} from "@/actions/product-actions";
import { handleGetAllEventActivities } from "@/actions/activity-actions";
import { cn } from "@/lib/utils";
import CardSkeleton from "../Loading/CardSkeleton";
import ProductCard from "./ProductCard";
import ProductBuyModalForm from "./ProductBuyModalForm";
import { runWithToast } from "@/lib/client/run-with-toast";
import useMercadoPago from "@/hooks/use-mercado-pago";
import type { IPaymentFormData } from "@mercadopago/sdk-react/esm/bricks/payment/type";
import type { ProductBuyDataI } from "@/schemas/product-schema";
import { useRouter } from "next/navigation";
import { Input } from "../ui/input";
import { Boxes, ListFilter, Search } from "lucide-react";

interface ProductListSectionProps {
  currentEvent: { id: string; slug: string };
  isEventCreator: boolean;
  isAdminStatus: {isAdmin: boolean, type: "admin" | "master_admin" | ""}
  isCreationModalOpen: boolean,
  setIsCreationModalOpen: Dispatch<SetStateAction<boolean>>;
}

export default function ProductListSection({
  currentEvent,
  isEventCreator,
  isAdminStatus,
  isCreationModalOpen,
  setIsCreationModalOpen,
}: ProductListSectionProps) {
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductResponseI>();
  const [allProducts, setAllProducts] = useState<ProductResponseI[]>([]);
  const [allActivities, setAllActivities] = useState<ActivityResponseI[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [query, setQuery] = useState("");

  const { selectPaymentMethod } = useMercadoPago();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const [allActivitiesData, allProductsData] = await Promise.all([
        handleGetAllEventActivities(currentEvent.slug),
        handleGetAllEventProducts(currentEvent.slug),
      ]);
      setAllActivities(allActivitiesData.data?.map(item => item.activity) || []);
      setAllProducts(allProductsData.data || []);
      setLoading(false);
    };
    fetchProducts();
  }, [currentEvent.slug]);


  const filteredSortedProducts: ProductResponseI[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q.length
      ? allProducts.filter((p) => {
          const name = (p.name ?? "").toLowerCase();
          const description = (p.description ?? "").toLowerCase();
          return name.includes(q) || description.includes(q);
        })
      : allProducts;
  }, [allProducts, query]);


  if (loading) {
    return (
      <div className="w-full mt-6">
        <div className="flex w-full gap-2 mb-6">
          <div className="flex-1 bg-white rounded-lg shadow-md h-10 flex items-center justify-center animate-pulse" />
        </div>
        <CardSkeleton count={6} />
      </div>
    );
  }

  const clearFilters = () => setQuery("");

  const openCreationProductModal = (productToUpdate?: ProductResponseI) => {
    setSelectedProduct(productToUpdate);
    setIsCreationModalOpen(true);
  };
  const openPurchaseProductModal = (productToBuy: ProductResponseI) => {
    setSelectedProduct(productToBuy);
    setIsPurchaseModalOpen(true);
  };

  const handleProductCreate = (newProduct: ProductResponseI) => {
    setAllProducts((prev) => [...prev, newProduct]);
  };

  const handleProductUpdate = (updatedProduct: ProductResponseI) => {
    setAllProducts((prev) =>
      prev.map((p) => (p.ID === updatedProduct.ID ? updatedProduct : p))
    );
  };

  const handlePaymentSelector = async (pay: IPaymentFormData, buyableProduct: ProductBuyDataI) => {
    const result = await selectPaymentMethod(
      pay,
      currentEvent.slug,
      selectedProduct,
      buyableProduct
    );
    if (result.data != null && "product_id" in result.data) handleProductPurchase(result.data);
    return result;
  };

  const handleProductPurchase = (
    purchasedProduct: ProductPurchasesResponseI
  ) => {
    setAllProducts((prev) =>
      prev.map((p) =>
        p.ID === purchasedProduct.product_id
          ? {
              ...p,
              quantity: Math.max(
                (p.quantity || 0) - purchasedProduct.quantity,
                0
              ),
            }
          : p
      )
    );
  };

  const handleProductDelete = async (product_id: string) => {
    const result = await runWithToast(
      handleDeleteProduct({ product_id: product_id }, currentEvent.slug),
      {
        loading: "Apagando o produto...",
        success: () => "Produto apagado com sucesso!",
        error: () => "Erro ao apagar o produto",
      }
    );
    if (result.success) setAllProducts((prev) => prev.filter((p) => p.ID !== product_id));
  };

  return (
    <>
      <div
        className={cn(
          "flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3",
          "w-full mt-2 justify-center items-center"
        )}
      >
        <div className="relative flex-1">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar produtos..."
            className={cn(
              "w-full h-10 rounded-md border border-zinc-300 bg-white pr-9 pl-10",
              "outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
            )}
          />
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
        </div>

        <div
          className={cn(
            "h-10 px-3 rounded-md flex items-center gap-2",
            "bg-white border border-zinc-300 text-zinc-800"
          )}
          title={`${allProducts.length} produtos cadastrados`}
        >
          <Boxes className="w-4 h-4" />
          <span className="whitespace-nowrap">{allProducts.length} Produtos</span>
        </div>
      </div>
      {filteredSortedProducts.length !== 0 ? (
        <div
          className={cn(
            "relative w-full h-full max-h-screen pb-32 sm:pb-24",
            "overflow-clip overflow-y-auto scrollbar-unvisible overscroll-contain"
          )}
        >
          <div className="grid justify-center md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 p-6">
            {filteredSortedProducts?.map((product) => (
              <ProductCard
                key={product.ID}
                data={product}
                isEventCreator={isEventCreator}
                onOpenPurchaseModal={openPurchaseProductModal}
                onUpdateFormOpen={() =>
                  isEventCreator ? openCreationProductModal(product) : null
                }
                onDelete={handleProductDelete}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full my-10 px-3 sm:px-5 lg:px-10">
          <div
            className={cn(
              "mx-auto max-w-xl text-center rounded-xl border border-dashed border-zinc-300",
              "bg-white/70 p-8 sm:p-10 shadow-sm"
            )}
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100">
              <Search className="h-7 w-7 text-zinc-500" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-800">
              Nenhum produto encontrado
            </h3>
            <p className="mt-1 text-sm text-zinc-600">
              Não encontramos resultados para a sua pesquisa atual. Tente
              ajustar os termos ou alterar os filtros.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={clearFilters}
                className={cn(
                  "h-9 px-3 rounded-md flex items-center gap-2",
                  "bg-zinc-100 text-zinc-800 hover:bg-zinc-200 transition-colors"
                )}
                title="Limpar busca e filtros"
              >
                <ListFilter className="w-4 h-4" />
                <span>Limpar filtros</span>
              </button>
            </div>
          </div>
        </div>
      )}
      <ProductModalForm
        currentEvent={currentEvent}
        activities={allActivities}
        product={selectedProduct}
        isCreating={!selectedProduct}
        open={isCreationModalOpen}
        setOpen={setIsCreationModalOpen}
        onProductCreate={handleProductCreate}
        onProductUpdate={handleProductUpdate}
      />

      {selectedProduct && <ProductBuyModalForm
        slug={currentEvent.slug}
        product={selectedProduct}
        open={isPurchaseModalOpen}
        setOpen={(open) => {
          setIsPurchaseModalOpen(open);
          if(!open) router.refresh();
        }}
        handlePaymentSelector={handlePaymentSelector}
      />}
    </>
  );
}
