'use server';

import { getAuthTokens } from "@/lib/cookies";
import { fetchWrapper } from "@/lib/fetch";
import { FetchError } from "@/types/utility-classes";

// is the same as SuccessResponse, but i used a new to difference them
export type ActionResult<T> = {
  success: boolean;
  data: T | null;
  message: string;
};

type RequestInitLite<B> = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: B; // json body stringify
  headers?: Record<string, string>;
  withAuth?: boolean;
};

function safeStringify(data: unknown) {
  try {
    return JSON.stringify(data);
  } catch {
    return '[unserializable]';
  }
}

export async function actionRequest<B, T>(
  path: string,
  init: RequestInitLite<B> = {}
): Promise<ActionResult<T>> {
  const method = init.method ?? 'GET';
  const withAuth = init.withAuth ?? true;

const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init.headers ?? {}),
  };

  if (withAuth) {
    const { accessToken, refreshToken } = await getAuthTokens();
    headers.Authorization = `Bearer ${accessToken}`;
    headers.Refresh = `Bearer ${refreshToken}`;
  }

  try {
    const res = await fetchWrapper<T>(path, {
      method,
      body: init.body ? safeStringify(init.body) : undefined,
      headers
    });

    const anyRes = res as unknown as { result?: { data?: T; message?: string } };

    return {
      success: true,
      data: anyRes?.result?.data || null,
      message: anyRes?.result?.message ?? 'Operação realizada com sucesso',
    };
  } catch (error: unknown) {
    const message =
      error instanceof FetchError
        ? `${error.message}`
        : 'Erro desconhecido ao comunicar com o servidor';
    console.error(message);

    return {
      success: false,
      data: null,
      message,
    };
  }
}
