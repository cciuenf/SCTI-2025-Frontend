"use client"

import { useState, useEffect } from "react";
import ProductModalForm from "./ProductModalForm";
import ProductsList from "./ProductsList";
import { ProductResponseI } from "@/types/product-interfaces";
import { handleGetAllEventProducts } from "@/actions/product-actions";

interface ProductListSectionProps { slug: string; }

export default function ProductListSection({ slug }: ProductListSectionProps) {
  const [products, setProducts] = useState<ProductResponseI[]>([]);

  const refreshProducts = async () => {
    const response = await handleGetAllEventProducts(slug);
    if (response.success) setProducts(response.data);
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

  useEffect(() => { refreshProducts(); }, []);

  return (
    <>
      <ProductModalForm 
        slug={slug} 
        isCreating={true} 
        onProductCreate={handleProductCreate}
      />
      <h1 className="font-black text-2xl mb-6 mt-2">Produtos:</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-7xl">
        <ProductsList 
          products={products}
          slug={slug} 
          onProductUpdate={handleProductUpdate}
          onProductDelete={handleProductDelete}
        />
      </div>
    </>
  );
} 