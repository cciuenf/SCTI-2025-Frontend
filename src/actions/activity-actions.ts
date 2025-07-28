"use server";

import { getAuthTokens } from "@/lib/cookies";
import { fetchWrapper } from "@/lib/fetch";
import { ActivityCreationDataI } from "@/schemas/activity-schema";
import { ActivityResponseI } from "@/types/activity-interface";
import { FetchError } from "@/types/utility-classes";

export async function handleGetUserEventActivities(slug: string) {
  const { accessToken, refreshToken } = await getAuthTokens();
  try {
    const res = await fetchWrapper<ActivityResponseI[]>(`/events/${slug}/user-activities`, {
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
      return { success: false, data: [], message: `Erro ao resgastar as atividades: ${error.message}` };
    } else {
      console.error("Erro desconhecido ao resgatar as atividades", error);
      return { success: false, data: [], message: "Erro desconhecido ao resgatar as atividades" };
    }
  }
}

export async function handleGetAllEventActivities(slug: string) {
  try {
    const res = await fetchWrapper<ActivityResponseI[]>(`/events/${slug}/activities`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return { success: true, data: res.result.data, message: res.result.message };
  } catch (error) {
    if (error instanceof FetchError) {
      console.error("Erro ao resgatar as atividades", error.message);
      return { success: false, data: [], message: `Erro ao resgastar as atividades: ${error.message}` };
    } else {
      console.error("Erro desconhecido ao resgatar as atividades", error);
      return { success: false, data: [], message: "Erro desconhecido ao resgatar as atividades" };
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
    return { success: true, data: res.result.data, message: res.result.message };
  } catch (error) {
    if (error instanceof FetchError) {
      console.error("Erro na criação da atividade", error.message);
      return { success: false, data: null, message: `Erro na criação da atividade: ${error.message}`, };
    } else {
      console.error("Erro desconhecido na criação da atividade", error);
      return { success: false, data: null, message: "Erro desconhecido na criação da atividade" };
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
    return { success: true, data: res.result.data, message: res.result.message };
  } catch (error) {
    if (error instanceof FetchError) {
      console.error("Erro ao excluir a atividade", error.message);
      return { success: false, data: null, message: `Erro ao excluir a atividade: ${error.message}` };
    } else {
      console.error("Erro desconhecido ao excluir a atividade", error);
      return { success: false, data: null, message: "Erro desconhecido ao excluir a atividade" };
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
    return { success: true, data: res.result.data, message: res.result.message };
  } catch (error) {
    if (error instanceof FetchError) {
      console.error("Erro ao atualizar a atividade", error.message);
      return { success: false, data: null, messsage: `Erro ao atualizar a atividade: ${error.message}` };
    } else {
      console.error("Erro desconhecido ao atualizar a atividade", error);
      return { success: false, data: null, message: "Erro desconhecido ao atualizar a atividade" };
    }
  }
}

export async function handleRegisterFromActivity(data: ActivityResponseI, slug: string, userId: string) {
  const { accessToken, refreshToken } = await getAuthTokens();
  const activityType = data.is_standalone ? 'register-standalone' : 'register'
  try {
    const res = await fetchWrapper<ActivityResponseI>(`/events/${slug}/activity/${activityType}`, {
      method: "POST",
      body: JSON.stringify({activity_id: data.ID, user_id: userId}),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        Refresh: `Bearer ${refreshToken}`,
      },
    });
    return { success: true, data: res.result.data, message: res.result.message };
  } catch (error) {
    if (error instanceof FetchError) {
      console.error("Erro ao registrar na atividade", error.message);
      return { success: false, data: null, message: `Erro ao registrar na atividade: ${error.message}` };
    } else {
      console.error("Erro desconhecido ao registrar na atividade", error);
      return { success: false, data: null, message: "Erro desconhecido ao registrar na atividade" };
    }
  }
}

export async function handleUnregisterFromActivity(data: ActivityResponseI, slug: string, userId: string) {
  const { accessToken, refreshToken } = await getAuthTokens();
  const activityType = data.is_standalone ? 'unregister-standalone' : 'unregister'
  try {
    const res = await fetchWrapper<ActivityResponseI>(`/events/${slug}/activity/${activityType}`, {
      method: "POST",
      body: JSON.stringify({activity_id: data.ID, user_id: userId}),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        Refresh: `Bearer ${refreshToken}`,
      },
    });
    return { success: true, data: res.result.data, message: res.result.message };
  } catch (error) {
    if (error instanceof FetchError) {
      console.error("Erro ao desinscrever da atividade", error.message);
      return { success: false, data: null, message: `Erro ao desinscrever da atividade: ${error.message}` };
    } else {
      console.error("Erro desconhecido ao desinscrever da atividade", error);
      return { success: false, data: null, message: "Erro desconhecido ao desinscrever da atividade" };
    }
  }
}

export async function handleGetRegisteredUsersInActivity(data: { id: string }, slug: string) {
  const { accessToken, refreshToken } = await getAuthTokens();
  try {
    const res = await fetchWrapper<any>(`/events/${slug}/activity/registrations/${data.id}`, {
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
      console.error("Erro ao adquirir os usuários registrados na atividade", error.message);
      return { success: false, data: null, message: `Erro ao adquirir os usuários registrados na atividade: ${error.message}` };
    } else {
      console.error("Erro desconhecido ao adquirir os usuários registrados na atividade", error);
      return { success: false, data: null, message: "Erro desconhecido ao adquirir os usuários registrados na atividade" };
    }
  }
}

export async function handleGetUsersWhoParticipateInActivity(data: { id: string }, slug: string) {
  const { accessToken, refreshToken } = await getAuthTokens();
  try {
    const res = await fetchWrapper<any>(`/events/${slug}/activity/attendants/${data.id}`, {
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
      console.error("Erro ao adquirir os usuários que participaram na atividade", error.message);
      return { success: false, data: null, message: `Erro ao adquirir os usuários que participaram na atividade: ${error.message}` };
    } else {
      console.error("Erro desconhecido ao adquirir os usuários que participaram na atividade", error);
      return { success: false, data: null, message: "Erro desconhecido ao adquirir os usuários que participaram na atividade" };
    }
  }
}