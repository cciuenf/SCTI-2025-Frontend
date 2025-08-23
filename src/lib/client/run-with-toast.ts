'use client';

import { toast } from 'sonner';
import type { ActionResult } from '@/actions/_utils';
import { translateMessage } from './i18n/enToPt';

type Messages<T> = {
  loading?: string;
  success?: (res: ActionResult<T>) => string;
  error?: (res: ActionResult<T>) => string;
};

export async function runWithToast<T>(
  actionCall: Promise<ActionResult<T>>,
  messages?: Messages<T>
): Promise<ActionResult<T>> {
  const id = toast.loading(messages?.loading ?? "Processando...");
  const res = await actionCall;
  if (res.success) {
    const msg = messages?.success?.(res);
    toast.success(msg ?? "Operação realizada com sucesso!", { id, 
      description: translateMessage(res.message)
    });
  } else {
    const msg = messages?.error?.(res);
    toast.error(msg ?? "Falha na operação", { id, 
      description: translateMessage(res.message)
    });
  }
  return res;
}
