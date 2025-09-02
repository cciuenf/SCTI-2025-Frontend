import { formatBR, safeTime } from "@/lib/date-utils";
import { cn, convertNumberToBRL } from "@/lib/utils";
import type { ProductResponseI } from "@/types/product-interfaces";
import { 
  Ban, CalendarClock, Coins, Eye, EyeOff, Gift, InfinityIcon, Package, Tag, Ticket 
} from "lucide-react";

export default function OwnedProductCard({
  p,
  qty,
  giftedCount,
}: {
  p: ProductResponseI;
  qty: number;
  giftedCount: number;
}) {
  const isBlocked = p.is_blocked;
  const isHidden = p.is_hidden;
  const isTicket = p.is_ticket_type || p.is_event_access;
  const isPhysical = p.is_physical_item;

  return (
    <div
      className={cn(
        'w-full bg-white p-4 min-w-[300] mx-auto',
        'group relative rounded-2xl border border-zinc-200 shadow-sm',
        'transition-all hover:shadow-md hover:border-zinc-300'
      )}
    >
      <div className="mb-2 flex items-center gap-2">
        {isBlocked && (
          <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
            <Ban className="mr-1 h-3.5 w-3.5" /> Bloqueado
          </span>
        )}
        {isHidden && (
          <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
            <EyeOff className="mr-1 h-3.5 w-3.5" /> Oculto
          </span>
        )}
      </div>

      {/* Header */}
      <div className="mb-3 flex items-start gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100">
          {isTicket ? (
            <Ticket className="h-6 w-6 text-zinc-700" />
          ) : isPhysical ? (
            <Package className="h-6 w-6 text-zinc-700" />
          ) : (
            <Eye className="h-6 w-6 text-zinc-700" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="truncate text-lg font-semibold text-zinc-900">{p.name}</h3>
          <p className="line-clamp-2 text-sm text-zinc-600">{p.description}</p>
        </div>
      </div>

      {/* Badges */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
          {isPhysical ? 'Físico' : 'Digital'}
        </span>
        {isTicket && (
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
            Acesso/Ingresso
          </span>
        )}
        {p.has_unlimited_quantity && (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
            <InfinityIcon className="h-3.5 w-3.5" /> Qtd. ilimitada
          </span>
        )}
        {p.is_public ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
            <Eye className="h-3.5 w-3.5" /> Público
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
            <EyeOff className="h-3.5 w-3.5" /> Privado
          </span>
        )}
      </div>

      {/* Buy Info */}
      <div className="mb-2 grid grid-cols-2 gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-3 text-sm">
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-zinc-700" />
          <div className="flex flex-col">
            <span className="text-zinc-500">Preço</span>
            <span className="font-medium text-zinc-800">{convertNumberToBRL(p.price_int)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-zinc-700" />
          <div className="flex flex-col">
            <span className="text-zinc-500">Quantidade</span>
            <span className="font-medium text-zinc-800">{qty}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Gift className="h-4 w-4 text-zinc-700" />
          <div className="flex flex-col">
            <span className="text-zinc-500">Recebido</span>
            <span className="font-medium text-zinc-800">{giftedCount}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CalendarClock className="h-4 w-4 text-zinc-700" />
          <div className="flex flex-col">
            <span className="text-zinc-500">Expira</span>
            <span className="font-medium text-zinc-800">{formatBR(safeTime(p.expires_at))}</span>
          </div>
        </div>

        {/* Tokens */}
        <div className="col-span-2 flex items-center gap-2 rounded-lg bg-primary/20 px-3 py-2">
          <Coins className="h-4 w-4 text-accent" />
          <div className="flex flex-col">
            <span className="text-zinc-500 text-xs">Tokens</span>
            <span className="font-medium">{p.token_quantity || "Não fornece nenhum token"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}