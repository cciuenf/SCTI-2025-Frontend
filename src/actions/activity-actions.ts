"use server";

import { getAuthTokens } from "@/lib/cookies";
import { fetchWrapper } from "@/lib/fetch";
import { ActivityCreationDataI } from "@/schemas/activity-schema";
import { ActivityResponseI } from "@/types/activity-interface";
import { FetchError } from "@/types/utility-classes";

export async function handleGetUserEventActivities(slug: string) {
  const { accessToken, refreshToken } = await getAuthTokens();
  try {
    const res = await fetchWrapper<ActivityResponseI[]>(`/events/${slug}/accesses`, {
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
      console.error("Erro ao resgatar as atividades", error.message);
      return { status: error.status, data: [], success: false };
    } else {
      console.error("Erro desconhecido ao resgatar as atividades", error);
      return { message: "Erro desconhecido", data: [], success: false };
    }
  }
}

export async function handleGetAllEventActivities(slug: string) {
  const { accessToken, refreshToken } = await getAuthTokens();
  try {
    const res = await fetchWrapper<ActivityResponseI[]>(`/events/${slug}/activities`, {
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
      console.error("Erro ao resgatar as atividades", error.message);
      return { status: error.status, data: [], success: false };
    } else {
      console.error("Erro desconhecido ao resgatar as atividades", error);
      return { message: "Erro desconhecido", data: [], success: false };
    }
  }
}
  
export async function handleCreateActivity(data: ActivityCreationDataI, slug: string) {
  const { accessToken, refreshToken } = await getAuthTokens();
  try {
    const res = await fetchWrapper<ActivityResponseI>(`/events/${slug}/activity`, {
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
      console.error("Erro na criação da atividade", error.message);
      return { status: error.status, success: false };
    } else {
      console.error("Erro na criação da atividade", error);
      return { message: "Erro desconhecido", success: false };
    }
  }
}

export async function handleDeleteActivity(data: { activity_id: string }, slug: string) {
  const { accessToken, refreshToken } = await getAuthTokens();
  try {
    const res = await fetchWrapper<string>(`/events/${slug}/activity`, {
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
      console.error("Erro ao excluir a atividade", error.message);
      return { success: false };
    } else {
      console.error("Erro desconhecido ao excluir a atividade", error);
      return { success: false };
    }
  }
}

export async function handleUpdateActivity(data: Partial<ActivityCreationDataI>, slug: string, activity_id: string) {
  const { accessToken, refreshToken } = await getAuthTokens();

  try {
    const res = await fetchWrapper<ActivityResponseI>(`/events/${slug}/activity`, {
      method: "PATCH",
      body: JSON.stringify({...data, activity_id}),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        Refresh: `Bearer ${refreshToken}`,
      },
    });
    return { success: true, data: res.result.data };
  } catch (error) {
    if (error instanceof FetchError) {
      console.error("Erro ao atualizar a atividade", error.message);
      return { success: false };
    } else {
      console.error("Erro desconhecido ao atualizar a atividade", error);
      return { success: false };
    }
  }
}