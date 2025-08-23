"use server";

import type {
  EventResponseI,
  EventSubscriptionResponseI,
} from "@/types/event-interfaces";
import { fetchWrapper } from "@/lib/fetch";
import { getAuthTokens } from "@/lib/cookies";
import { FetchError } from "@/types/utility-classes";
import type { EventCreationDataI } from "@/schemas/event-schema";
import { actionRequest } from "./_utils";

export async function handleCreateEvent(data: EventCreationDataI) {
  return actionRequest<EventCreationDataI, EventResponseI>("/events", {
    method: "POST",
    body: data,
  });
}

export async function handleGetEvents() {
  return actionRequest<null, EventResponseI[]>("/events", { withAuth: false });
}

export async function handleGetUserSubscribedEvents() {
  return actionRequest<null, EventResponseI[]>("/user-events");
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
  return actionRequest<null, EventResponseI>(`/events/${slug}`, { withAuth: false });
}

export async function handleDeleteSlugCreatedEvents(slug: string) {
  return actionRequest<null, null>(`/events/${slug}`, {
    method: "DELETE",
  });
}

export async function handleUpdateSlugCreatedEvents(
  data: Partial<EventCreationDataI>,
  slug: string
) {
  return actionRequest<Partial<EventCreationDataI>, EventResponseI>(`/events/${slug}`, {
    method: "PATCH",
    body: data,
  });
}

export async function handleRegisterFromEvent(slug: string) {
  return actionRequest<null, EventSubscriptionResponseI>(`/events/${slug}/register`, {
    method: "POST",
  });
}

export async function handleUnresgiterFromEvent(slug: string) {
  return actionRequest<null, EventSubscriptionResponseI>(`/events/${slug}/unregister`, {
    method: "POST",
  });
}

export async function handlePromoteUserInEvent(slug: string, email: string) {
  return actionRequest<{email: string}, EventSubscriptionResponseI>(`/events/${slug}/promote`, {
    method: "POST",
    body: { email },
  });
}

export async function handleDemoteUserInEvent(slug: string, email: string) {
  return actionRequest<{email: string}, EventSubscriptionResponseI>(`/events/${slug}/demote`, {
    method: "POST",
    body: { email },
  });
}
