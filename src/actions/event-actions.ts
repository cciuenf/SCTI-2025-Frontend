"use server";

import {
  EventResponseI,
  EventSubscriptionResponseI,
} from "@/types/event-interfaces";
import { fetchWrapper } from "@/lib/fetch";
import { getAuthTokens } from "@/lib/cookies";
import { FetchError } from "@/types/utility-classes";
import { redirect } from "next/navigation";
import { EventCreationDataI } from "@/schemas/event-schema";

export async function handleCreateEvent(data: EventCreationDataI) {
  const { accessToken, refreshToken } = await getAuthTokens();

  try {
    const res = await fetchWrapper<EventResponseI>("/events", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        Refresh: `Bearer ${refreshToken}`,
      },
    });

    return { success: res.result.success, data: res.result.data };
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
    const res = await fetchWrapper<EventResponseI[]>("/events", {
      method: "GET",
    });
    return { success: true, data: res.result.data };
  } catch (error) {
    if (error instanceof FetchError) {
      console.error("Erro ao obter todos os eventos", error.message);
      return { success: false };
    } else {
      console.error("Erro desconhecido ao obter todos os eventos", error);
      return { success: false };
    }
  }
}

export async function handleGetUserCreatedEvents() {
  const { accessToken, refreshToken } = await getAuthTokens();

  try {
    const res = await fetchWrapper<EventResponseI[]>("/events/created", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Refresh: `Bearer ${refreshToken}`,
      },
    });
    return { success: true, data: res.result.data };
  } catch (error) {
    if (error instanceof FetchError) {
      console.error("Erro ao obter os eventos criados pelo usuário", error.message);
      return { success: false };
    } else {
      console.error("Erro desconhecido ao obter eventos criados pelo usuário", error);
      return { success: false };
    }
  }
}

export async function handleGetUserSubscribedEvents() {
  const { accessToken, refreshToken } = await getAuthTokens();

  try {
    const res = await fetchWrapper<EventResponseI[]>("/user-events", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Refresh: `Bearer ${refreshToken}`,
      },
    });
    return { success: true, data: res.result.data };
  } catch (error) {
    if (error instanceof FetchError) {
      console.error("Erro ao obter os eventos onde o usuário está inscrito", error.message);
      return { success: false };
    } else {
      console.error("Erro desconhecido ao obter eventos onde o usuário está inscrito", error);
      return { success: false };
    }
  }
}

export async function handleGetPublicCreatedEvents() {
  try {
    const res = await fetchWrapper<EventResponseI[]>("/events/public", {
      method: "GET",
    });
    return { success: true, data: res.result.data };
  } catch (error) {
    if (error instanceof FetchError) {
      console.error("Erro ao obter os eventos públicos", error.message);
      return { success: false };
    } else {
      console.error("Erro desconhecido ao obter os eventos públicos", error);
      return { success: false };
    }
  }
}

export async function handleGetSlugCreatedEvent(slug: string) {
  try {
    const res = await fetchWrapper<EventResponseI>(`/events/${slug}`, {
      method: "GET",
    });
    return { success: true, data: res.result.data };
  } catch (error) {
    if (error instanceof FetchError) {
      console.error(`Erro ao obter o evento com slug: ${slug}`, error.message);
      redirect("/events");
    }
  }
}

export async function handleDeleteSlugCreatedEvents(slug: string) {
  const { accessToken, refreshToken } = await getAuthTokens();

  try {
    await fetchWrapper(`/events/${slug}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Refresh: `Bearer ${refreshToken}`,
      },
    });
    return { success: true }
  } catch (error) {
    if (error instanceof FetchError) {
      console.error(`Erro ao deletar o evento com slug: ${slug}`, error.message);
      return { success: false };
    }
  }
  redirect("/events");
}

export async function handleUpdateSlugCreatedEvents(
  data: Partial<EventCreationDataI>,
  slug: string
) {
  const { accessToken, refreshToken } = await getAuthTokens();

  try {
    const res = await fetchWrapper<EventResponseI>(`/events/${slug}`, {
      method: "PATCH",
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
      console.error("Erro ao atualizar o evento", error.message);
      return { success: false };
    } else {
      console.error("Erro desconhecido ao atualizar o evento", error);
      return { success: false };
    }
  }
}

export async function handleRegisterFromEvent(slug: string) {
  const { accessToken, refreshToken } = await getAuthTokens();

  try {
    const res = await fetchWrapper<EventSubscriptionResponseI>(
      `/events/${slug}/register`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Refresh: `Bearer ${refreshToken}`,
        },
      }
    );

    return {
      success: true,
      data: res.result.data,
      message: res.result.message,
    };
  } catch (error) {
    if (error instanceof FetchError) {
      console.error("Erro ao registrar usuário no evento", error.message);
      return { success: false };
    } else {
      console.error("Erro desconhecido ao registrar usuário no evento", error);
      return { success: false };
    }
  }
}

export async function handleUnresgiterFromEvent(slug: string) {
  const { accessToken, refreshToken } = await getAuthTokens();

  try {
    const res = await fetchWrapper<EventSubscriptionResponseI>(
      `/events/${slug}/unregister`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Refresh: `Bearer ${refreshToken}`,
        },
      }
    );
    return {
      success: true,
      message: res.result.message,
    };
  } catch (error) {
    if (error instanceof FetchError) {
      console.error("Erro ao desregistrar usuário no evento", error.message);
      return { success: false };
    } else {
      console.error(
        "Erro desconhecido ao ao desregistrar usuário no evento",
        error
      );
      return { success: false };
    }
  }
}

export async function handlePromoteUserInEvent(slug: string, email: string) {
  const { accessToken, refreshToken } = await getAuthTokens();

  try {
    const res = await fetchWrapper<EventSubscriptionResponseI>(
      `/events/${slug}/promote`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          Refresh: `Bearer ${refreshToken}`,
        },
        body: JSON.stringify({ email: email }),
      }
    );
    return {
      success: true,
      message: res.result.message,
    };
  } catch (error) {
    if (error instanceof FetchError) {
      console.error("Erro ao promover usuário no evento", error.message);
      return { success: false };
    } else {
      console.error("Erro desconhecido ao promover usuário", error);
      return { success: false };
    }
  }
}

export async function handleDemoteUserInEvent(slug: string, email: string) {
  const { accessToken, refreshToken } = await getAuthTokens();

  try {
    const res = await fetchWrapper<EventSubscriptionResponseI>(
      `/events/${slug}/demote`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          Refresh: `Bearer ${refreshToken}`,
        },
        body: JSON.stringify({ email: email }),
      }
    );
    return {
      success: true,
      data: res.result.data,
      message: res.result.message,
    };
  } catch (error) {
    if (error instanceof FetchError) {
      console.error("Erro ao rebaixar usuário no evento", error.message);
      return { success: false };
    } else {
      console.error("Erro desconhecido ao rebaixar usuário", error);
      return { success: false };
    }
  }
}
