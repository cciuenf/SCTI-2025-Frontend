"use client";
import { Calendar, Edit3, Trash2, Store, Coins } from "lucide-react";
import { Badge } from "../ui/badge";
import { cn, convertNumberToBRL } from "@/lib/utils";
import { Button } from "../ui/button";
import ConfirmActionButton from "../ConfirmActionButton";
import type { ProductResponseI } from "@/types/product-interfaces";
import { formatFullDate } from "@/lib/date-utils";

type Props = {
  data: ProductResponseI;
  isEventCreator: boolean;
  isAdminStatus: {isAdmin: boolean, type: "admin" | "master_admin" | ""}

  onOpenPurchaseModal?: ((data: ProductResponseI) => void) | null;
  onUpdateFormOpen?: () => void | null;
  onDelete?: (id: string) => Promise<void> | null;
};

const ProductCard = ({
  data,
  isEventCreator,
  isAdminStatus,
  onOpenPurchaseModal,
  onUpdateFormOpen,
  onDelete
}: Props) => {
  const handleBuyModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!onOpenPurchaseModal) return;
    onOpenPurchaseModal(data);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if(onUpdateFormOpen) onUpdateFormOpen();
  };

  const handleDelete = async () => {
    if(onDelete) await onDelete(data.ID);
  };

  return (
    <div className={cn(
      "not-md:min-w-80 min-w-auto flex flex-col justify-left items-center bg-white rounded-lg shadow-md",
      "px-1 py-3 transition-all hover:scale-105"
    )}>
      <div className="w-full flex flex-col justify-around items-start gap-3.5 px-2">
        <div className="w-full flex justify-between">
          <Badge
            className="bg-accent text-secondary max-w-[120px] truncate overflow-hidden whitespace-nowrap"
            title={data.is_public ? "Público" : "Privado"}
          >
            {data.is_public ? "Público" : "Privado"}
          </Badge>
          <div className="flex items-center gap-3">
            {isEventCreator && (
              <>
                <Edit3
                  className={cn(
                    "w-5 h-5 cursor-pointer transition-transform duration-200",
                    "hover:text-accent hover:scale-125"
                  )}
                  onClick={handleEdit}
                />
                <ConfirmActionButton
                  trigger={(onClick) => (
                    <Trash2
                      className={cn(
                        "w-5 h-5 cursor-pointer transition-transform duration-200",
                        "hover:text-red-500 hover:scale-125"
                      )}
                      onClick={onClick}
                    />
                  )}
                  message="Tem certeza que deseja apagar esse produto?"
                  onConfirm={handleDelete}
                />
              </>
            )}
          </div>
        </div>

        <h2 className="font-bold text-lg mb-0">{data.name}</h2>

        <div className="flex justify-between items-center">
          <Store className="text-accent h-4 w-4 mr-2.5" />
          <h3 className="opacity-90 text-sm">
            {data.has_unlimited_quantity ? "Infinito" : `restam ${data.quantity} unidades`}
          </h3>
        </div>

        <div className="flex justify-between items-center">
          <Calendar className="text-accent h-4 w-4 mr-2.5" />
          <h3 className="opacity-90 text-sm">
            Expira em: {formatFullDate(data.expires_at)}
          </h3>
        </div>

        <h3 className="h-9 w-full text-ellipsis overflow-hidden text-left opacity-90 text-sm" title={data.description}>
          {data.description || "Não Informado"}
        </h3>
        <div className="flex w-full h-12 overflow-x-auto overflow-y-hidden gap-3 items-center px-2">
          {data.is_physical_item && <Badge
            className="bg-accent text-secondary max-w-[120px] truncate overflow-hidden whitespace-nowrap"
            title="Físico"
          >
            Físico
          </Badge>}
          {data.is_blocked && <Badge
            className="bg-accent text-secondary max-w-[120px] truncate overflow-hidden whitespace-nowrap"
            title="Bloqueado"
          >
            Bloqueado
          </Badge>}
          {data.is_ticket_type && <Badge
            className="bg-accent text-secondary max-w-[120px] truncate overflow-hidden whitespace-nowrap"
            title="Ticket"
          >
            Ticket
          </Badge>}
          {data.is_hidden && <Badge
            className="bg-accent text-secondary max-w-[120px] truncate overflow-hidden whitespace-nowrap"
            title="Oculto"
          >
            Oculto
          </Badge>}
          {data.is_event_access && <Badge
            className="bg-accent text-secondary max-w-[120px] truncate overflow-hidden whitespace-nowrap"
            title="Acesso ao Evento"
          >
            Acesso ao Evento
          </Badge>}
          {data.is_activity_access && <Badge
            className="bg-accent text-secondary max-w-[120px] truncate overflow-hidden whitespace-nowrap"
            title="Acesso a Atividade"
          >
            Acesso a Atividade
          </Badge>}
          {data.is_activity_token && <Badge
            className="bg-accent text-secondary max-w-[120px] truncate overflow-hidden whitespace-nowrap"
            title="Token de Atividade"
          >
            <Coins /> +{data.token_quantity || 0}
          </Badge>}
        </div>
        <h2 className="font-bold text-secondary text-xl">
          {convertNumberToBRL(data.price_int)}
        </h2>
        {onOpenPurchaseModal && (
          <Button
            onClick={handleBuyModal}
            className={cn(
              "w-full py-1 rounded-sm shadow-md cursor-pointer duration-300 transition-colors",
              "bg-accent text-secondary font-medium hover:text-accent hover:bg-secondary"
            )}
          >
            Comprar
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
