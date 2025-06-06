"use client"

import { handleDeleteProduct } from "@/actions/product-actions"
import { ProductResponseI } from "@/types/product-interfaces"
import ProductModalForm from "./ProductModalForm";
import ProductBuyModalForm from "./ProductBuyModalForm";

interface ProductProps {
  product: ProductResponseI;
  slug: string;
  onProductDelete: (productId: string) => Promise<void>;
  onProductUpdate: (updatedProduct: ProductResponseI) => Promise<void>;
}

export default function ProductHandle({ product, slug, onProductDelete, onProductUpdate }: ProductProps) {
  return (
  <div className="mt-4 flex gap-2">
    <ProductModalForm 
      slug={slug} 
      isCreating={false} 
      product={product} 
      onProductUpdate={onProductUpdate}
    />
    <ProductBuyModalForm slug={slug} product={product}/>
    <button onClick={async () => {
      const result = await handleDeleteProduct({product_id: product.ID}, slug);
      if (result?.success) {
        await onProductDelete(product.ID);
      }
    }}
    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors">
      Deletar
    </button>
  </div>
  )
}