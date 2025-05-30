"use client"

import { handleDeleteProduct } from "@/actions/product-actions"
import { ProductResponseI } from "@/types/product-interfaces"
import ProductModalForm from "./ProductModalForm";
import ProductBuyModalForm from "./ProductBuyModalForm";

interface ProductProps {
  product: ProductResponseI;
  slug: string
}

export default function ProductHandle({ product, slug }: ProductProps) {
  return (
  <div className="mt-4 flex gap-2">
    <ProductModalForm slug={slug} isCreating={false} product={product}/>
    <ProductBuyModalForm slug={slug} product={product}/>
    <button onClick={() => handleDeleteProduct({product_id: product.ID}, slug)}
    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors">
      Deletar
    </button>
  </div>
  )
}