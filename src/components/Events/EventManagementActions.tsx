"use client";

import { CheckCircle, Eye, Pencil, Users } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useUserEvents } from "@/contexts/UserEventsProvider";
import LoadingSpinner from "../Loading/LoadingSpinner";
import { EventResponseI } from "@/types/event-interfaces";
import EventModalForm from "./EventModalForm";
import { useEffect, useState } from "react";

interface Props {
  isEventCreator: boolean;
  event: EventResponseI;
}

const EventManagementActions = ({ isEventCreator, event }: Props) => {
  const [isEditEventModalOpen, setIsEventModalOpen] = useState(false);
  const { myEvents, allEvents, handleRegister, handleUnregister, loading, handleEventUpdate } = useUserEvents();
  const updatedEvent = allEvents.find(e => e.Slug === event.Slug) || event;

  if (loading) {
    return (
      <div className="w-full max-w-5xl mt-6">
        <LoadingSpinner />
      </div>
    );
  }

  const isSubscribed = myEvents.find(e => e.Slug === updatedEvent.Slug);

  const handleRegisterState = async (e: React.MouseEvent) => {
    if (!handleRegister || !handleUnregister) return;
    if (isSubscribed) await handleUnregister(updatedEvent.Slug);
    else await handleRegister(updatedEvent.Slug);
  };

  return(
    <>
      {isEventCreator && (
        <>
          {/* <Button
            // onClick={onMarkPresence}
            className="flex-none p-2 rounded-sm shadow-md cursor-pointer transition-colors duration-200 bg-foreground text-white font-medium hover:text-accent hover:bg-secondary"
            title="Marcar Presença"
          >
            <CheckCircle size={18} />
            <span className="hidden sm:inline ml-1">Marcar Presença</span>
          </Button>

          <Button
            // onClick={onViewPresences}
            className="flex-none p-2 rounded-sm shadow-md cursor-pointer transition-colors duration-200 bg-secondary text-white font-medium hover:text-accent hover:bg-secondary"
            title="Ver Presenças"
          >
            <Eye size={18} />
            <span className="hidden sm:inline ml-1">Ver Presenças</span>
          </Button>

          <Button
            // onClick={onViewRegistrations}
            className="flex-none p-2 rounded-sm shadow-md cursor-pointer transition-colors duration-200 bg-foreground text-white font-medium hover:text-accent hover:bg-secondary"
            title="Ver Inscrições"
          >
            <Users size={18} />
            <span className="hidden sm:inline ml-1">Ver Inscrições</span>
          </Button> */}

          <Button
            onClick={() => setIsEventModalOpen(true)}
            className="flex-none p-2 rounded-sm shadow-md cursor-pointer transition-colors duration-200 bg-accent text-secondary font-medium hover:text-accent hover:bg-secondary"
            title="Editar"
          >
            <Pencil size={18} />
            <span className="hidden sm:inline ml-1">Editar</span>
          </Button>
        </>
      )}

      {
        <Button
          onClick={handleRegisterState}
          className={cn(
            "flex-none p-2 rounded-sm shadow-md cursor-pointer transition-colors duration-200",
            isSubscribed
              ? "bg-red-500 text-white font-medium hover:text-red-500 hover:bg-white border hover:border-red-500"
              : "bg-accent text-secondary font-medium hover:text-accent hover:bg-secondary"
          )}
          title={isSubscribed ? "Cancelar inscrição" : "Inscrever-se"}
        >
          {isSubscribed ? "Cancelar inscrição" : "Inscrever-se"}
        </Button>
      }
      <EventModalForm 
        event={updatedEvent}
        isCreating={false}
        open={isEditEventModalOpen}
        setOpen={setIsEventModalOpen}
        onEventUpdate={handleEventUpdate}
      />
    </>
  )
}

export default EventManagementActions;