"use server";

import type { ProductCreationDataI } from "@/schemas/product-schema";
import type { 
  ProductBuyCredentialsI, 
  ProductPixPurchaseResponseI, 
  ProductPurchasesResourceResponseI, 
  ProductPurchasesResponseI, 
  ProductResponseI, 
  UserTokensResponseI 
} from "@/types/product-interfaces";
import { actionRequest } from "./_utils";


export async function handleCreateProduct(data: ProductCreationDataI, slug: string) {
  return actionRequest<ProductCreationDataI, ProductResponseI>(`/events/${slug}/product`, {
    method: "POST",
    body: data,
  });
}

export async function handleUpdateProduct(
  data: Partial<ProductCreationDataI>, 
  slug: string, 
  product_id: string
) {
  return actionRequest<{product: Partial<ProductCreationDataI>, product_id: string},
    ProductResponseI>(`/events/${slug}/product`, 
    {
      method: "PATCH",
      body: { product: data, product_id: product_id },
    }
  );
}

export async function handleDeleteProduct(data: { product_id: string }, slug: string) {
  return actionRequest<{ product_id: string }, ProductResponseI>(`/events/${slug}/product`, {
    method: "DELETE",
    body: data,
  });
}

export async function handleGetAllEventProducts(slug: string) {
  return actionRequest<null, ProductResponseI[]>(`/events/${slug}/products`);
}

export async function handleBuyProduct(data: ProductBuyCredentialsI, slug: string) {
  return actionRequest<ProductBuyCredentialsI, 
    { 
      purchase: ProductPurchasesResponseI 
      purchase_resource: ProductPurchasesResourceResponseI
    }>(`/events/${slug}/purchase`, 
    {
      method: "POST",
      body: data,
    }
  );
}

export async function handleBuyProductPix(data: ProductBuyCredentialsI, slug: string) {
  return actionRequest<ProductBuyCredentialsI, ProductPixPurchaseResponseI>
  (
    `/events/${slug}/forced-pix`, 
    {
      method: "POST",
      body: data,
    }
  );
}

export async function handleGetAllUserProducts() {
  return actionRequest<null, ProductResponseI[]>("/user-products");
}

export async function handleGetAllUserProductsPurchases() {
  return actionRequest<null, ProductPurchasesResponseI[]>("/user-purchases");
}

export async function handleGetAllUserTokens() {
  return actionRequest<null, UserTokensResponseI[]>("/user-tokens");
}
