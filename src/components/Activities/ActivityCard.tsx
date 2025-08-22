import {
  Calendar,
  MapPin,
  Edit3,
  Trash2,
  Clock,
  Speaker,
  CheckCircle,
  Eye,
  Users,
} from "lucide-react";
import { Badge } from "../ui/badge";
import {
  cn,
  formatEventTimeRange,
  getActivityLevel,
  getActivityRequirements,
} from "@/lib/utils";
import { Button } from "../ui/button";
import { formatEventDateRange } from "@/lib/utils";
import ConfirmActionButton from "../ConfirmActionButton";
import type { ActivityResponseI } from "@/types/activity-interface";

type Props = {
  data: ActivityResponseI;
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
    if (isSubscribed) await onUnregister(data);
    else await onRegister(data);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onUpdateFormOpen) onUpdateFormOpen();
  };

  const handleDelete = async () => {
    if (onDelete) await onDelete(data.ID);
  };

  return (
    <div
      className={cn(
        "not-md:min-w-80 min-w-auto flex flex-col justify-left items-center bg-white rounded-lg shadow-md",
        "px-1 py-3 transition-all hover:scale-105"
      )}
    >
      <div className="w-full flex flex-col justify-between items-start gap-3.5 px-2 h-full">
        <div className="w-full flex justify-between">
          <Badge
            className="bg-accent text-secondary max-w-[120px] truncate overflow-hidden whitespace-nowrap"
            title={
              data.is_standalone ? data.standalone_slug.toUpperCase() : "Evento"
            }
          >
            {data.is_standalone ? data.standalone_slug.toUpperCase() : "Evento"}
          </Badge>
          <div className="flex items-center gap-3">
            {isEventCreator && (
              <>
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
                      onPresenceManagerOpen && onPresenceManagerOpen(data)
                    }
                  />
                </span>
                <span
                  title="Ver Presenças"
                  role="img"
                  aria-label="Ver Presenças"
                >
                  <Eye
                    className={cn(
                      "w-5 h-5 cursor-pointer transition-transform duration-200",
                      "hover:text-accent hover:scale-125"
                    )}
                    onClick={() =>
                      onViewUsersOpen && onViewUsersOpen(false, data)
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
                    onClick={() =>
                      onViewUsersOpen && onViewUsersOpen(true, data)
                    }
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
              </>
            )}
          </div>
        </div>

        <h2 className="w-full font-bold text-lg truncate" title={data.name}>
          {data.name}
        </h2>

        <div className="flex justify-between items-center">
          <Calendar className="text-accent h-4 w-4 mr-2.5" />
          <h3 className="opacity-90 text-sm">
            {formatEventDateRange(
              new Date(data.start_time),
              new Date(data.end_time)
            )}
          </h3>
        </div>
        <div className="flex justify-between items-center">
          <Clock className="text-accent h-4 w-4 mr-2.5" />
          <h3 className="opacity-90 text-sm">
            {formatEventTimeRange(
              new Date(data.start_time),
              new Date(data.end_time)
            )}
          </h3>
        </div>
        <div className="flex justify-between items-center">
          <Speaker className="text-accent h-4 w-4 mr-2.5" />
          <h3 className="opacity-90 text-sm">{data.speaker}</h3>
        </div>
        <div className="flex justify-between items-center">
          <MapPin className="text-accent h-4 w-4 mr-2.5" />
          <h3 className="opacity-90 text-sm">
            {data.location || "Não Informado"}
          </h3>
        </div>

        <h3 className="h-9 w-full text-ellipsis overflow-hidden text-left opacity-90 text-sm">
          {data.description || "Não Informado"}
        </h3>
        {data.requirements && (
          <>
            <h3 className="text-sm">Requisitos:</h3>
            <ul className="flex w-full flex-wrap items-center gap-2 list-disc list-inside marker:text-accent">
            {getActivityRequirements(data.requirements).map((req, i) => (
              <li className="text-xs" key={`${req}${Math.random() * i}`}>
                {req}
              </li>
            ))}
           </ul>
          </>
        )}
        <div className="flex w-9/10 h-12 overflow-x-auto overflow-y-hidden gap-3 items-center px-2 mx-auto">
          {data.level !== "none" && (
            <Badge
              className="bg-accent text-secondary max-w-[120px] truncate overflow-hidden whitespace-nowrap"
              title={data.level}
            >
              {getActivityLevel(data.level)}
            </Badge>
          )}
          {data.has_fee && (
            <Badge
              className="bg-accent text-secondary max-w-[120px] truncate overflow-hidden whitespace-nowrap"
              title="Há Taxa"
            >
              Há Taxa
            </Badge>
          )}
          {data.is_blocked && (
            <Badge
              className="bg-accent text-secondary max-w-[120px] truncate overflow-hidden whitespace-nowrap"
              title="Bloqueado"
            >
              Bloqueado
            </Badge>
          )}
          {data.is_mandatory && (
            <Badge
              className="bg-accent text-secondary max-w-[120px] truncate overflow-hidden whitespace-nowrap"
              title="Obrigatório"
            >
              Obrigatório
            </Badge>
          )}
          {data.is_hidden && (
            <Badge
              className="bg-accent text-secondary max-w-[120px] truncate overflow-hidden whitespace-nowrap"
              title="Oculto"
            >
              Oculto
            </Badge>
          )}
          {data.is_standalone && (
            <Badge
              className="bg-accent text-secondary max-w-[120px] truncate overflow-hidden whitespace-nowrap"
              title="Independente"
            >
              Independente
            </Badge>
          )}
          {data.type && (
            <Badge
              className="bg-accent text-secondary max-w-[120px] truncate overflow-hidden whitespace-nowrap"
              title={data.type}
            >
              {data.type.charAt(0).toUpperCase() + data.type.substring(1)}
            </Badge>
          )}
        </div>
        {onRegister && onUnregister && (
          <Button
            onClick={handleRegisterState}
            className={cn(
              "w-full py-1 rounded-sm shadow-md cursor-pointer duration-300 transition-colors",
              isSubscribed
                ? "bg-red-500 text-white font-medium hover:text-red-500 hover:bg-white border border-red-500"
                : "bg-accent text-secondary font-medium hover:text-accent hover:bg-secondary"
            )}
          >
            {isSubscribed ? "Cancelar inscrição" : "Inscrever-se"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ActivityCard;
