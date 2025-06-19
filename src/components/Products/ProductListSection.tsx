"use client"

import { useState, useEffect } from "react";
import ProductModalForm from "./ProductModalForm";
import ProductsList from "./ProductsList";
import { ProductResponseI } from "@/types/product-interfaces";
import { ActivityResponseI } from "@/types/activity-interface";
import { handleGetAllEventProducts } from "@/actions/product-actions";
import { handleGetAllEventActivities } from "@/actions/activity-actions";

interface ProductListSectionProps { 
  currentEvent: { id: string; slug: string }
}

export default function ProductListSection({ currentEvent }: ProductListSectionProps) {
  const [products, setProducts] = useState<ProductResponseI[]>([]);
  const [activities, setActivities] = useState<ActivityResponseI[]>([]);

  const refreshProducts = async () => {
    const response = await handleGetAllEventProducts(currentEvent.slug);
    if (response.success) setProducts(response.data);
  };

  const refreshActivities = async () => {
    const response = await handleGetAllEventActivities(currentEvent.slug);
    if (response.success) setActivities(response.data);
  };

  const handleProductCreate = async (newProduct: ProductResponseI) => {
    setProducts(prevProducts => [...prevProducts, {
      ...newProduct,
      access_targets: newProduct.access_targets || []
    }]);
  };

  const handleProductUpdate = async (updatedProduct: ProductResponseI) => {
    setProducts(prevProducts => 
      prevProducts.map(p => p.ID === updatedProduct.ID ? {
        ...updatedProduct,
        access_targets: updatedProduct.access_targets || []
      } : p)
    );
  };

  const handleProductDelete = async (productId: string) => {
    setProducts(prevProducts => prevProducts.filter(p => p.ID !== productId));
  };

  useEffect(() => { 
    refreshProducts();
    refreshActivities();
  }, []);

  return (
    <>
      <ProductModalForm 
        currentEvent={currentEvent} 
        isCreating={true} 
        activities={activities}
        onProductCreate={handleProductCreate}
      />
      <h1 className="font-black text-2xl mb-6 mt-2">Produtos:</h1>
      <div className="flex justify-center flex-wrap gap-4 w-full">
        <ProductsList 
          products={products}
          currentEvent={currentEvent}
          activities={activities}
          onProductUpdate={handleProductUpdate}
          onProductDelete={handleProductDelete}
        />
      </div>
    </>
  );
} 