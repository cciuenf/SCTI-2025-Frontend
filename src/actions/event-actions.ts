"use server";

import {
  EventCredentialsI,
  EventResponseI,
  EventSubscriptionResponseI,
} from "@/types/event-interfaces";
import { fetchWrapper } from "@/lib/fetch";
import { getAuthTokens } from "@/lib/cookies";
import { FetchError } from "@/types/utility-classes";
import { redirect } from "next/navigation";

export async function handleCreateEvent(data: EventCredentialsI) {
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

    return { success: res.result.success, createdEventName: res.result.data };
  } catch (error) {
    if (error instanceof FetchError) {
      console.error("Erro na criação do evento", error.message);
      return { status: error.status, success: false };
    } else {
      console.error("Erro na criação do event", error);
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
      console.error("Erro ao obter os eventos", error.message);
      return { success: false };
    } else {
      console.error("Erro desconhecido ao obter eventos", error);
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
      console.error("Erro ao obter os eventos", error.message);
      return { success: false };
    } else {
      console.error("Erro desconhecido ao obter eventos do usuário", error);
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
      console.error("Erro ao obter os eventos", error.message);
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
      console.error("Erro ao obter os eventos por slug", error.message);
      redirect("/events");
    }
  }
}
export async function handleDeleteSlugCreatedEvents(slug: string) {
  const { accessToken, refreshToken } = await getAuthTokens();

  try {
    const res = await fetchWrapper<EventResponseI>(`/events/${slug}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Refresh: `Bearer ${refreshToken}`,
      },
    });
  } catch (error) {
    if (error instanceof FetchError) {
      console.error("Erro ao deletar o evento", error.message);
      return { success: false };
    }
  }
  redirect("/events");
}
export async function handleUpdateSlugCreatedEvents(
  data: Partial<EventCredentialsI>,
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

export async function handleResgiterFromEvent(slug: string) {
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

    console.log(`Registrou`);

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

    console.log(`Desresgistrou`);
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
      console.error("Erro ao promover usuári no evento", error.message);
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
