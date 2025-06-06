"use client"

import { handleDeleteProduct } from "@/actions/product-actions"
import { ProductResponseI } from "@/types/product-interfaces"
import { ActivityResponseI } from "@/types/activity-interface"
import ProductModalForm from "./ProductModalForm";
import ProductBuyModalForm from "./ProductBuyModalForm";
import { Button } from "../ui/button";

interface ProductProps {
  product: ProductResponseI;
  slug: string;
  activities: ActivityResponseI[];
  onProductDelete: (productId: string) => Promise<void>;
  onProductUpdate: (updatedProduct: ProductResponseI) => Promise<void>;
}

export default function ProductHandle({ product, slug, activities, onProductDelete, onProductUpdate }: ProductProps) {
  const submitDelete = async (id: string) => {
    const result = await handleDeleteProduct({product_id: product.ID}, slug);
    if (result?.success) await onProductDelete(product.ID);
  }
  
  return (
  <div className="mt-4 flex gap-2">
    <ProductModalForm 
      slug={slug} 
      isCreating={false} 
      product={product} 
      activities={activities}
      onProductUpdate={onProductUpdate}
    />
    <ProductBuyModalForm slug={slug} product={product}/>
    <Button variant={"yellow"} onClick={async () => await submitDelete(product.ID)}>
      Deletar
    </Button>
  </div>
  )
}