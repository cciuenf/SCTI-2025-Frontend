"use server";

import { getAuthTokens } from "@/lib/cookies";
import { fetchWrapper } from "@/lib/fetch";
import { ProductBuyCredentialsI, ProductCredentialsI, ProductPurchasesResponseI, ProductResponseI, UserTokensResponseI } from "@/types/product-interfaces";
import { FetchError } from "@/types/utility-classes";


export async function handleCreateProduct(data: ProductCredentialsI, slug: string) {
  const { accessToken, refreshToken } = await getAuthTokens();
  try {
    const res = await fetchWrapper<ProductResponseI>(`/events/${slug}/product`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        Refresh: `Bearer ${refreshToken}`,
      },
    });
    return { success: true, data: res.result.data };
  } catch (error) {
    if (error instanceof FetchError) {
      console.error("Erro na criação do produto", error.message);
      return { status: error.status, success: false };
    } else {
      console.error("Erro na criação do produto", error);
      return { message: "Erro desconhecido", success: false };
    }
  }
}

export async function handleUpdateProduct(data: Partial<ProductCredentialsI>, slug: string, product_id: string) {
  const { accessToken, refreshToken } = await getAuthTokens();

  try {
    const res = await fetchWrapper<ProductResponseI>(`/events/${slug}/product`, {
      method: "PATCH",
      body: JSON.stringify({product: data, product_id: product_id}),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        Refresh: `Bearer ${refreshToken}`,
      },
    });
    return { success: true, data: res.result.data };
  } catch (error) {
    if (error instanceof FetchError) {
      console.error("Erro ao atualizar o produto", error.message);
      return { success: false };
    } else {
      console.error("Erro desconhecido ao atualizar o produto", error);
      return { success: false };
    }
  }
}

export async function handleDeleteProduct(data: { product_id: string }, slug: string) {
  const { accessToken, refreshToken } = await getAuthTokens();
  try {
    const res = await fetchWrapper<ProductResponseI>(`/events/${slug}/product`, {
      method: "DELETE",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        Refresh: `Bearer ${refreshToken}`,
      },
    });
    return { success: true, data: res.result.data };
  } catch (error) {
    if (error instanceof FetchError) {
      console.error("Erro ao excluir o produto", error.message);
      return { success: false };
    } else {
      console.error("Erro desconhecido ao excluir o evento", error);
      return { success: false };
    }
  }
}
  
export async function handleGetAllEventProducts(slug: string) {
  const { accessToken, refreshToken } = await getAuthTokens();
  try {
    const res = await fetchWrapper<ProductResponseI[]>(`/events/${slug}/products`, {
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

export async function handleBuyProduct(data: ProductBuyCredentialsI, slug: string) {
  const { accessToken, refreshToken } = await getAuthTokens();

  try {
    const res = await fetchWrapper<any>(`/events/${slug}/purchase`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        Refresh: `Bearer ${refreshToken}`,
      },
    });
    return { success: true, data: res.result.data };
  } catch (error) {
    if (error instanceof FetchError) {
      console.error("Erro ao comprar o produto", error.message);
      return { success: false };
    } else {
      console.error("Erro desconhecido ao comprar o produto", error);
      return { success: false };
    }
  }
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