"use server";

import { EventCredentialsI, EventResponseI } from "@/types/event-interfaces";
import { fetchWrapper } from "@/lib/fetch";
import { getAuthTokens } from "@/lib/cookies";
import { FetchError } from "@/types/utility-classes";

export async function handleCreateEvent(data: EventCredentialsI) {
  const { accessToken, refreshToken } = await getAuthTokens();

  try {
    const res = await fetchWrapper<EventResponseI>("/events", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Refresh: `Bearer ${refreshToken}`,
      },
    });

    //return {success: res.result.success, createdEventName: res.result.data.activities}
  } catch (error) {
    if (error instanceof FetchError) {
      console.error("Erro na criação do evento", error.message);
      return { status: error.status, success: false };
    } else {
      console.error("Erro na criação do evento", error);
      return { message: "Erro desconhecido", success: false };
    }
  }
}

export async function handleGetEvents() {
  try {
    const res = await fetchWrapper<EventResponseI>("/events", {
      method: "GET",
    });
    return { success: true, data: res.result.data.activities };
  } catch (error) {
    if (error instanceof FetchError) {
      console.error("Erro ao obter os eventos", error.message);
      return { success: false };
    }
  }
}

export async function handleGetUserCreatedEvents() {
  const { accessToken, refreshToken } = await getAuthTokens();

  try {
    const res = await fetchWrapper<EventResponseI>("/events/created", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Refresh: `Bearer ${refreshToken}`,
      },
    });
    return { success: true, data: res.result.data.activities };
  } catch (error) {
    if (error instanceof FetchError) {
      console.error("Erro ao obter os eventos", error.message);
      return { success: false };
    }
  }
}

export async function handleGetPublicCreatedEvents() {
  try {
    const res = await fetchWrapper<EventResponseI>("/events/public", {
      method: "GET",
    });
    return { success: true, data: res.result.data.activities };
  } catch (error) {
    if (error instanceof FetchError) {
      console.error("Erro ao obter os eventos", error.message);
      return { success: false };
    }
  }
}

export async function handleGetSlugCreatedEvents(slug: string) {
  try {
    const res = await fetchWrapper<EventResponseI>(`/events/public/${slug}`, {
      method: "GET",
    });
    return { success: true, data: res.result.data.activities };
  } catch (error) {
    if (error instanceof FetchError) {
      console.error("Erro ao obter os eventos", error.message);
      return { success: false };
    }
  }
}
export async function handleDeleteSlugCreatedEvents(slug: string) {
  const { accessToken, refreshToken } = await getAuthTokens();

  try {
    const res = await fetchWrapper<EventResponseI>(`/events/public/${slug}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Refresh: `Bearer ${refreshToken}`,
      },
    });
    return { success: true, data: res.result.data.activities };
  } catch (error) {
    if (error instanceof FetchError) {
      console.error("Erro ao obter os eventos", error.message);
      return { success: false };
    }
  }
}
export async function handleUpdateSlugCreatedEvents(slug: string) {
  const { accessToken, refreshToken } = await getAuthTokens();

  try {
    const res = await fetchWrapper<EventResponseI>(`/events/public/${slug}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Refresh: `Bearer ${refreshToken}`,
      },
    });
    return { success: true, data: res.result.data.activities };
  } catch (error) {
    if (error instanceof FetchError) {
      console.error("Erro ao obter os eventos", error.message);
      return { success: false };
    }
  }
}
