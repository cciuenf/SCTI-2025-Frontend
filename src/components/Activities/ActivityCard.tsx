import {
  Calendar,
  MapPin,
  Edit3,
  Trash2,
  Speaker,
  CheckCircle,
  Eye,
  Users,
  Coins,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { formatEventDateRange } from "@/lib/utils";
import ConfirmActionButton from "../ConfirmActionButton";
import type { ActivityResponseI, ActivityWithSlotResponseI } from "@/types/activity-interface";
import LevelBadge from "./LevelBadge";
import RequirementsHoverCard from "./RequirementsHoverCard";

type Props = {
  data: ActivityWithSlotResponseI;
  isEventCreator: boolean;
  isSubscribed: boolean;
  onPresenceManagerOpen?: (data: ActivityResponseI) => void | null;
  onViewUsersOpen?: (
    is_registrations: boolean,
    data: ActivityResponseI
  ) => void | null;
  onRegister?: ((data: ActivityResponseI) => Promise<void>) | null;
  onUnregister?: ((data: ActivityResponseI) => Promise<void>) | null;
  onUpdateFormOpen?: () => void | null;
  onDelete?: (id: string) => Promise<void> | null;
};

const ActivityCard = ({
  data,
  isEventCreator,
  isSubscribed,
  onViewUsersOpen,
  onPresenceManagerOpen,
  onRegister,
  onUnregister,
  onUpdateFormOpen,
  onDelete,
}: Props) => {
  const handleRegisterState = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!onRegister || !onUnregister) return;
    if (isSubscribed) await onUnregister(data.activity);
    else await onRegister(data.activity);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onUpdateFormOpen) onUpdateFormOpen();
  };

  const handleDelete = async () => {
    if (onDelete) await onDelete(data.activity.ID);
  };

  return (
    <div
      className={cn(
        "not-md:min-w-80 min-w-auto flex flex-col justify-left items-center bg-white rounded-lg shadow-md",
        "px-1 py-3 transition-all hover:scale-105",
        data.activity.has_fee && "bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 "
      )}
    >
      <div className="w-full flex flex-col justify-between items-start gap-3.5 px-2 h-full">
        <div className="w-full flex justify-between px-0.5">
          <div className="flex gap-2">
            {data.activity.has_fee && 
              <div className="w-6 h-6 rounded-full bg-orange-500 text-white p-1">
                <Coins className="w-full h-full"/>
              </div>
            }
            <Badge
              className="bg-accent text-secondary max-w-[120px] truncate overflow-hidden whitespace-nowrap"
              title={data.activity.type && data.activity.type}
            >
              {data.activity.type && (data.activity.type.charAt(0).toUpperCase() + data.activity.type.substring(1)) }
            </Badge>
            <LevelBadge level={data.activity.level} />
            {!data.activity.has_fee && <Badge
              className="bg-green-500 text-white truncate overflow-hidden whitespace-nowrap"
            >
              Gratuito
            </Badge>}
          </div>
          {data.activity.requirements && (
            <RequirementsHoverCard data={data.activity.requirements} />
          )}
        </div>

        <h2 className="w-full h-14 px-3 flex items-center" title={data.activity.name}>
          <span className="w-full text-lg font-bold text-center line-clamp-2 break-words">
            {data.activity.name}
          </span>
        </h2>

        <div className="flex justify-between items-center">
          <Calendar className="text-accent h-4 w-4 mr-2.5" />
          <h3 className="opacity-90 text-sm">
            {formatEventDateRange(
              new Date(data.activity.start_time),
              new Date(data.activity.end_time)
            )}
          </h3>
        </div>
        <div className="flex justify-between items-center">
          <Speaker className="text-accent h-4 w-4 mr-2.5" />
          <h3 className="opacity-90 text-sm">{data.activity.speaker}</h3>
        </div>
        <div className="flex justify-between items-center">
          <MapPin className="text-accent h-4 w-4 mr-2.5" />
          <h3 className="opacity-90 text-sm">
            {data.activity.location || "Não Informado"}
          </h3>
        </div>
        <div className="flex justify-between items-center">
          <Users className="text-accent h-4 w-4 mr-2.5" />
          <h3 className="opacity-90 text-sm">
            {data.activity.has_unlimited_capacity ? "Vagas Ilimitadas" : 
              `${data.available_slots.available_slots} / ${data.available_slots.total_capacity} vagas`
            }
          </h3>
        </div>

        <h3 className="h-24 w-full overflow-y-auto text-left opacity-90 text-sm ">
          {data.activity.description || "Não Informado"}
        </h3>
        {(data.activity.is_blocked || data.activity.is_hidden) && (
          <div className="flex w-9/10 h-12 overflow-x-auto overflow-y-hidden gap-3 items-center px-2 mx-auto">
            {data.activity.is_blocked && (
              <Badge
                className="bg-accent text-secondary max-w-[120px] truncate overflow-hidden whitespace-nowrap"
                title="Bloqueado"
              >
                Bloqueado
              </Badge>
            )}
            {data.activity.is_hidden && (
              <Badge
                className="bg-accent text-secondary max-w-[120px] truncate overflow-hidden whitespace-nowrap"
                title="Oculto"
              >
                Oculto
              </Badge>
            )}
          </div>
        )}

        {isEventCreator && (
          <div className="flex w-3/5 items-center justify-around mx-auto">
            <span
              title="Marcar Presença"
              role="img"
              aria-label="Marcar Presença"
            >
              <CheckCircle
                className={cn(
                  "w-5 h-5 cursor-pointer transition-transform duration-200",
                  "hover:text-accent hover:scale-125"
                )}
                onClick={() =>
                  onPresenceManagerOpen && onPresenceManagerOpen(data.activity)
                }
              />
            </span>
            <span title="Ver Presenças" role="img" aria-label="Ver Presenças">
              <Eye
                className={cn(
                  "w-5 h-5 cursor-pointer transition-transform duration-200",
                  "hover:text-accent hover:scale-125"
                )}
                onClick={() =>
                  onViewUsersOpen && onViewUsersOpen(false, data.activity)
                }
              />
            </span>
            <span
              title="Ver Inscrições"
              role="img"
              aria-label="Ver Inscrições"
            >
              <Users
                className={cn(
                  "w-5 h-5 cursor-pointer transition-transform duration-200",
                  "hover:text-accent hover:scale-125"
                )}
                onClick={() => onViewUsersOpen && onViewUsersOpen(true, data.activity)}
              />
            </span>
            <span title="Editar" role="img" aria-label="Editar">
              <Edit3
                className={cn(
                  "w-5 h-5 cursor-pointer transition-transform duration-200",
                  "hover:text-accent hover:scale-125"
                )}
                onClick={handleEdit}
              />
            </span>
            <ConfirmActionButton
              trigger={(onClick) => (
                <span title="Deletar" role="img" aria-label="Deletar">
                  <Trash2
                    className={cn(
                      "w-5 h-5 cursor-pointer transition-transform duration-200",
                      "hover:text-red-500 hover:scale-125"
                    )}
                    onClick={onClick}
                  />
                </span>
              )}
              message="Tem certeza que deseja apagar essa atividade?"
              onConfirm={handleDelete}
            />
          </div>
        )}
        {onRegister && onUnregister && (
          <Button
            onClick={handleRegisterState}
            className={cn(
              "w-full py-1 rounded-sm shadow-md cursor-pointer duration-300 transition-colors",
              isSubscribed
                ? "bg-red-500 text-white font-medium hover:text-red-500 hover:bg-white border border-red-500"
                : "bg-accent text-secondary font-medium hover:text-accent hover:bg-secondary",
              data.activity.has_fee && "bg-orange-500 text-white"
            )}
          >
            {isSubscribed ? "Cancelar inscrição" : "Inscrever-se"}
            {data.activity.has_fee && !isSubscribed && (
              <>
                <Coins className="w-4 h-4" /> 1 Token
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ActivityCard;
