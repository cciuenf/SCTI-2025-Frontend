"use client"

import { handleDeleteProduct } from "@/actions/product-actions"
import { ProductResponseI } from "@/types/product-interfaces"
import { ActivityResponseI } from "@/types/activity-interface"
import ProductModalForm from "./ProductModalForm";
import ProductBuyModalForm from "./ProductBuyModalForm";
import { Button } from "../ui/button";

interface ProductProps {
  product: ProductResponseI;
  currentEvent: { id: string; slug: string }
  activities: ActivityResponseI[];
  onProductDelete: (productId: string) => Promise<void>;
  onProductUpdate: (updatedProduct: ProductResponseI) => Promise<void>;
}

export default function ProductHandle({ product, currentEvent, activities, onProductDelete, onProductUpdate }: ProductProps) {
  const submitDelete = async () => {
    const result = await handleDeleteProduct({product_id: product.ID}, currentEvent.slug);
    if (result?.success) await onProductDelete(product.ID);
  }
  
  return (
  <div className="mt-4 flex gap-2">
    <ProductModalForm 
      currentEvent={currentEvent}
      isCreating={false} 
      product={product} 
      activities={activities}
      onProductUpdate={onProductUpdate}
    />
    <ProductBuyModalForm slug={currentEvent.slug} product={product}/>
    <Button variant={"yellow"} onClick={async () => await submitDelete()}>
      Deletar
    </Button>
  </div>
  )
}