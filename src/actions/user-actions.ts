"use server";

import type { UserBasicInfo } from "@/types/auth-interfaces";
import { actionRequest } from "./_utils";

export async function handleGetUsersInfo(data: {id_array: string[]}) {
  return actionRequest<{id_array: string[]}, UserBasicInfo[]>("/users/batch" , {
    method: "POST",
    body: data,
    withAuth: false,
  });
}