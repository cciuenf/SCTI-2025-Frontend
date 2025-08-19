"use server";

import { getAuthTokens } from "@/lib/cookies";
import { fetchWrapper } from "@/lib/fetch";
import type { ProductCreationDataI } from "@/schemas/product-schema";
import type { 
  ProductBuyCredentialsI, 
  ProductPurchasesResponseI, 
  ProductResponseI, 
  UserTokensResponseI 
} from "@/types/product-interfaces";
import { FetchError } from "@/types/utility-classes";
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
  return actionRequest<ProductBuyCredentialsI, { purchase: ProductPurchasesResponseI }>(
    `/events/${slug}/purchase`, 
    {
      method: "POST",
      body: data,
    }
  );
  // const { accessToken, refreshToken } = await getAuthTokens();

  // try {
  //   const res = await fetchWrapper<{purchase: ProductPurchasesResponseI}>(`/events/${slug}/purchase`, {
  //     method: "POST",
  //     body: JSON.stringify(data),
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${accessToken}`,
  //       Refresh: `Bearer ${refreshToken}`,
  //     },
  //   });
  //   return { success: true, data: res.result.data };
  // } catch (error) {
  //   if (error instanceof FetchError) {
  //     console.error("Erro ao comprar o produto", error.message);
  //     return { success: false, message: error.message };
  //   } else {
  //     console.error("Erro desconhecido ao comprar o produto", error);
  //     return { success: false, message: "Erro desconhecido ao tentar comprar produto!" };
  //   }
  // }
}

export async function handleGetAllUserProducts() {
  const { accessToken, refreshToken } = await getAuthTokens();
  try {
    const res = await fetchWrapper<ProductResponseI[]>(`/user-products`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        Refresh: `Bearer ${refreshToken}`,
      },
    });
    return { success: true, data: res.result.data, message: res.result.message };
  } catch (error) {
    if (error instanceof FetchError) {
      console.error("Erro ao resgatar os produtos", error.message);
      return { status: error.status, data: [], success: false };
    } else {
      console.error("Erro desconhecido ao resgatar os produtos", error);
      return { message: "Erro desconhecido", data: [], success: false };
    }
  }
}

export async function handleGetAllUserProductsPurchases() {
  const { accessToken, refreshToken } = await getAuthTokens();
  try {
    const res = await fetchWrapper<ProductPurchasesResponseI[]>(`/user-purchases`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        Refresh: `Bearer ${refreshToken}`,
      },
    });
    return { success: true, data: res.result.data, message: res.result.message };
  } catch (error) {
    if (error instanceof FetchError) {
      console.error("Erro ao resgatar as compras", error.message);
      return { status: error.status, data: [], success: false };
    } else {
      console.error("Erro desconhecido ao resgatar as compras", error);
      return { message: "Erro desconhecido", data: [], success: false };
    }
  }
}

export async function handleGetAllUserTokens() {
  const { accessToken, refreshToken } = await getAuthTokens();
  try {
    const res = await fetchWrapper<UserTokensResponseI[]>(`/user-tokens`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        Refresh: `Bearer ${refreshToken}`,
      },
    });
    return { success: true, data: res.result.data, message: res.result.message };
  } catch (error) {
    if (error instanceof FetchError) {
      console.error("Erro ao resgatar os tokens", error.message);
      return { status: error.status, data: [], success: false };
    } else {
      console.error("Erro desconhecido ao resgatar os tokens", error);
      return { message: "Erro desconhecido", data: [], success: false };
    }
  }
}
