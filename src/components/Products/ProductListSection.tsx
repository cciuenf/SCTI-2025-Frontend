"use client";

import { useState, useEffect } from "react";
import ProductModalForm from "./ProductModalForm";
import type { 
  ProductPurchasesResponseI, 
  ProductResponseI
} from "@/types/product-interfaces";
import { ActivityResponseI } from "@/types/activity-interface";
import { handleDeleteProduct, handleGetAllEventProducts } from "@/actions/product-actions";
import { handleGetAllEventActivities } from "@/actions/activity-actions";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import CardSkeleton from "../Loading/CardSkeleton";
import { toast } from "sonner";
import ProductCard from "./ProductCard";
import ProductBuyModalForm from "./ProductBuyModalForm";
import useMercadoPago from "@/hooks/use-mercado-pago";
import type { IPaymentFormData } from "@mercadopago/sdk-react/esm/bricks/payment/type";
import { ProductBuyDataI } from "@/schemas/product-schema";

interface ProductListSectionProps { 
  currentEvent: { id: string; slug: string };
  isEventCreator: boolean;
}

export default function ProductListSection({ currentEvent, isEventCreator }: ProductListSectionProps) {
  const [isCreationModalOpen, setIsCreationModalOpen] = useState(false);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductResponseI>();
  const [allProducts, setAllProducts] = useState<ProductResponseI[]>([]);
  const [allActivities, setAllActivities] = useState<ActivityResponseI[]>([]);
  const [loading, setLoading] = useState(true);

  const { selectPaymentMethod } = useMercadoPago();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const [allActivitiesData, allProductsData] = await Promise.all([
        handleGetAllEventActivities(currentEvent.slug),
        handleGetAllEventProducts(currentEvent.slug),
      ]);
      setAllActivities(allActivitiesData?.data || []);
      setAllProducts(allProductsData?.data || []);
    } catch (error) {
      console.error("Erro ao carregar os produtos:", error);
      toast.error("Erro ao carregar os produtos");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-5xl mt-6">
        <div className="flex w-full gap-2 mb-6">
          <div className="flex-1 bg-white rounded-lg shadow-md h-10 flex items-center justify-center animate-pulse" />
        </div>
        <CardSkeleton count={6} />
      </div>
    );
  }

  const openCreationProductModal = (productToUpdate?: ProductResponseI) => {
    setSelectedProduct(productToUpdate);
    setIsCreationModalOpen(true);
  }
  const openPurchaseProductModal = (productToBuy: ProductResponseI) => {
    setSelectedProduct(productToBuy);
    setIsPurchaseModalOpen(true);
  }
  
  const handleProductCreate = (newProduct: ProductResponseI) => {
    setAllProducts(prev => [...prev, newProduct]);
  };

  const handleProductUpdate = (updatedProduct: ProductResponseI) => {
    setAllProducts(prev =>
      prev.map(p => p.ID === updatedProduct.ID ? updatedProduct : p)
    );
  };

  const handlePaymentSelector = async (pay: IPaymentFormData, buyableProduct: ProductBuyDataI) => {
    const result = await selectPaymentMethod(pay, currentEvent.slug, selectedProduct, buyableProduct);
    if(result.data && result.state) handleProductPurchase(result.data);
    else toast.error("Ocorreu um erro ao proceder com o pagamento!");
    return result;
  }

  const handleProductPurchase = (purchasedProduct: ProductPurchasesResponseI) => {
    setAllProducts(prev =>
      prev.map(p => p.ID === purchasedProduct.product_id 
        ? {...p, quantity: Math.max((p.quantity || 0) - purchasedProduct.quantity, 0)} 
        : p
      )
    );
  };

  const handleProductDelete = async (product_id: string) => {
    const res = await handleDeleteProduct({ product_id: product_id }, currentEvent.slug);
    if (res.success) {
      setAllProducts(prev => prev.filter(p => p.ID !== product_id));
      toast.success("Produto apagado com sucesso!");
    } else toast.error("Erro ao apagar o produto");
  };

  return (
    <>
      {isEventCreator &&
        <Button
          onClick={() => openCreationProductModal()}
          className={cn(
            "flex w-full p-5 rounded-sm shadow-md cursor-pointer",
            "transition-colors duration-200 bg-accent mb-4 font-bold",
            "text-secondary font-medium hover:text-accent hover:bg-secondary"
          )}
          title="Criar Produto"
        >
          <h2>Criar Produto</h2>
        </Button>
      }
      {allProducts.length !== 0 ? (
        <div className="w-full max-w-5xl my-6">
          <div className="grid justify-center md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allProducts?.map((product) => (
              <ProductCard
                key={product.ID}
                data={product}
                isEventCreator={isEventCreator}
                onOpenPurchaseModal={openPurchaseProductModal}
                onUpdateFormOpen={() => isEventCreator ? openCreationProductModal(product) : null}
                onDelete={handleProductDelete}
              />
            ))}
          </div>
        </div>
      ) : (
        <p className="mt-6 mb-10 text-center">Sem produtos disponíveis nessa seção</p>
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
        setOpen={setIsPurchaseModalOpen}
        handlePaymentSelector={handlePaymentSelector}
      />}
    </>

  );
}
