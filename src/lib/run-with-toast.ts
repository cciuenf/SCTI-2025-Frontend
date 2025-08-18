'use client';

import type { ActionResult } from '@/actions/_utils';
import { toast } from 'sonner';

type Messages<T> = {
  loading?: string;
  success?: (res: ActionResult<T>) => string;
  error?: (res: ActionResult<T>) => string;
};

export async function runWithToast<T>(
  actionCall: Promise<ActionResult<T>>,
  messages?: Messages<T>
): Promise<ActionResult<T>> {
  const id = toast.loading(messages?.loading ?? 'Processando...');
  const res = await actionCall;
  if (res.success) {
    toast.success(
      messages?.success?.(res) ?? res.message ?? 'Operação realizada com sucesso!', { id }
    );
  } else {
    toast.error(messages?.error?.(res) ?? res.message ?? 'Falha na operação', { id });
  }
  return res;
}
