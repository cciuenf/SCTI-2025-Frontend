import { getAuthTokens } from "@/lib/cookies";
import { fetchWrapper } from "@/lib/fetch";
import { ActivityResponseI } from "@/types/activity-interface";
import { FetchError } from "@/types/utility-classes";

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
  