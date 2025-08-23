"use server";

import type { ActivityCreationDataI } from "@/schemas/activity-schema";
import type { 
  ActivityRegistrationI, 
  ActivityResponseI, 
  ActivityWithSlotResponseI 
} from "@/types/activity-interface";
import { actionRequest } from "./_utils";

export async function handleGetUserEventActivities(slug: string) {
  return actionRequest<null, ActivityResponseI[]>(`/events/${slug}/user-activities`);
}

export async function handleGetAllEventActivities(slug: string) {
  return actionRequest<null, ActivityWithSlotResponseI[]>(`/events/${slug}/activities`, { 
    withAuth: false 
  });
}

export async function handleCreateActivity(data: ActivityCreationDataI, slug: string) {
  return actionRequest<ActivityCreationDataI, ActivityResponseI>(`/events/${slug}/activity`, {
    method: "POST",
    body: data,
  });
}

export async function handleDeleteActivity(data: { activity_id: string }, slug: string) {
  return actionRequest<{ activity_id: string }, string>(`/events/${slug}/activity`, {
    method: "DELETE",
    body: data,
  });
}

export async function handleUpdateActivity(
  data: Partial<ActivityCreationDataI>, 
  slug: string, 
  activity_id: string
) {
  return actionRequest<Partial<ActivityCreationDataI> & { activity_id: string }, 
    ActivityResponseI>(`/events/${slug}/activity`, {
    method: "PATCH",
    body: { ...data, activity_id },
  });
}

export async function handleRegisterFromActivity(
  data: ActivityResponseI, 
  slug: string, 
  userId: string
) {
  const activityType = data.is_standalone ? 'register-standalone' : 'register'
  return actionRequest<{ activity_id: string, user_id: string }, 
    ActivityResponseI>(`/events/${slug}/activity/${activityType}`, {
      method: "POST",
      body: { activity_id: data.ID, user_id: userId },
    }
  );
}

export async function handleUnregisterFromActivity(
  data: ActivityResponseI, 
  slug: string, 
  userId: string
) {
  const activityType = data.is_standalone ? 'unregister-standalone' : 'unregister'
  return actionRequest<{ activity_id: string, user_id: string }, 
    ActivityResponseI>(`/events/${slug}/activity/${activityType}`, {
      method: "POST",
      body: { activity_id: data.ID, user_id: userId },
    }
  );
}

export async function handleGetRegisteredUsersInActivity(data: { id: string }, slug: string) {
  return actionRequest<null, ActivityRegistrationI[]>(
    `/events/${slug}/activity/registrations/${data.id}`
  );
}

export async function handleGetUsersWhoParticipateInActivity(data: { id: string }, slug: string) {
  return actionRequest<null, ActivityRegistrationI[]>(
    `/events/${slug}/activity/attendants/${data.id}`
  );
}

export async function handleMarkAttendanceOfActivity(
  data: { activity_id: string, user_id: string },
  slug: string
) {
  return actionRequest<{ activity_id: string, user_id: string }, ActivityRegistrationI[]>(
    `/events/${slug}/activity/attend`, {
      method: "POST",
      body: data,
    }
  );
}

export async function handleRemoveAttendanceOfActivity(
  data: { activity_id: string, user_id: string },
  slug: string
) {
  return actionRequest<{ activity_id: string, user_id: string }, ActivityRegistrationI[]>(
    `/events/${slug}/activity/unattend`, {
      method: "POST",
      body: data,
    }
  );
}
