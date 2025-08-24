"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Calendar, MapPin, Eye, Edit3, Trash2, UserPlus2, UserMinus2 } from "lucide-react";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import ConfirmActionButton from "../ConfirmActionButton";
import { formatEventDateRange, normalizeDate } from "@/lib/date-utils";

type Props = {
  slug: string;
  name: string;
  local: string;
  start_date: Date;
  end_date: Date;
  description: string;

  isEventCreator: boolean;
  isSubscribed: boolean;
  onRegister?: ((id: string) => Promise<void>) | null;
  onUnregister?: ((id: string) => Promise<void>) | null;
  onUpdateFormOpen?: () => void | null;
  onEventRoleUserFormOpen?: (willPromote: boolean) => void | null;
  onDelete?: (id: string) => Promise<void> | null;
};

const EventCard = ({
  slug,
  name,
  start_date,
  end_date,
  local,
  description,
  isEventCreator,
  isSubscribed,
  onRegister,
  onUnregister,
  onUpdateFormOpen,
  onEventRoleUserFormOpen,
  onDelete
}: Props) => {
  const [isLoadingRegisterState, setIsLoadingRegisterState] = useState(false);
  const handleRegisterState = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!onRegister || !onUnregister) return;
    setIsLoadingRegisterState(true);
    if (isSubscribed) await onUnregister(slug);
    else await onRegister(slug);
    setIsLoadingRegisterState(false);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if(onUpdateFormOpen) onUpdateFormOpen();
  };

  const handleEventRole = (e: React.MouseEvent, willPromote: boolean = true) => {
    e.preventDefault();
    e.stopPropagation();
    if(onEventRoleUserFormOpen) onEventRoleUserFormOpen(willPromote);
  };

  const handleDelete = async () => {
    if(onDelete) await onDelete(slug);
  };

  return (
    <Link href={`/events/${slug}`} key={slug} className="block w-full h-full cursor-default">
      <div className={cn(
        "not-md:min-w-80 min-w-auto flex flex-col justify-left items-center bg-white rounded-lg shadow-md",
        "px-1 py-3 transition-all hover:scale-105"
      )}>
        <div className="w-full flex flex-col justify-around items-start gap-3.5 px-2">
          <div className="w-full flex justify-between">
            <Badge
              className="bg-accent text-secondary max-w-[120px] truncate overflow-hidden whitespace-nowrap"
              title={slug.toUpperCase()}
            >
              {slug.toUpperCase()}
            </Badge>
            <div className="flex items-center gap-3">
              <Eye className={cn(
                "w-5 h-5 cursor-pointer transition-transform duration-200",
                "hover:text-accent hover:scale-125"
              )} />
              {isEventCreator && (
                <>
                  <UserPlus2 
                    className={cn(
                      "w-5 h-5 cursor-pointer transition-transform duration-200",
                      "hover:text-accent hover:scale-125"
                    )} 
                    onClick={handleEventRole}
                  />
                  <UserMinus2
                    className={cn(
                      "w-5 h-5 cursor-pointer transition-transform duration-200",
                      "hover:text-accent hover:scale-125"
                    )} 
                    onClick={(e) => handleEventRole(e, false)}
                  />
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
                    message="Tem certeza que deseja apagar esse evento?"
                    onConfirm={handleDelete}
                  />
                </>
              )}
            </div>
          </div>

          <h2 className="w-full font-bold text-lg truncate" title={name}>{name}</h2>

          <div className="flex justify-between items-center">
            <Calendar className="text-accent h-4 w-4 mr-2.5" />
            <h3 className="opacity-90 text-sm">
              {formatEventDateRange(normalizeDate(start_date), normalizeDate(end_date))}
            </h3>
          </div>
          <div className="flex justify-between items-center">
            <MapPin className="text-accent h-4 w-4 mr-2.5" />
            <h3 className="opacity-90 text-sm">{local || "Não Informado"}</h3>
          </div>

          <h3 className="h-9 w-full text-ellipsis overflow-hidden text-left opacity-90 text-sm">
            {description || "Não Informado"}
          </h3>
          {(onRegister && onUnregister) && (
            <Button 
              onClick={handleRegisterState}
              className={cn(
                "w-full py-1 rounded-sm shadow-md cursor-pointer duration-300 transition-colors",
                isSubscribed
                  ? "bg-red-500 text-white font-medium hover:text-red-500 hover:bg-white border border-red-500"
                  : "bg-accent text-secondary font-medium hover:text-accent hover:bg-secondary"
              )}
              disabled={isLoadingRegisterState}
              title={isSubscribed ? "Cancelar inscrição" : "Inscrever-se"}
            >
              {isSubscribed ? "Cancelar inscrição" : "Inscrever-se"}
            </Button>
          )}
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
