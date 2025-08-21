"use client";

import { Pencil } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useUserEvents } from "@/contexts/UserEventsProvider";
import LoadingSpinner from "../Loading/LoadingSpinner";
import type { EventResponseI } from "@/types/event-interfaces";
import EventModalForm from "./EventModalForm";
import { useState } from "react";
import { redirect } from "next/navigation";

interface Props {
  isEventCreator: boolean;
  event: EventResponseI;
}

const EventManagementActions = ({ isEventCreator, event }: Props) => {
  const [isEditEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isLoadingRegisterState, setIsLoadingRegisterState] = useState(false);
  const { 
    myEvents, 
    allEvents, 
    handleRegister, 
    handleUnregister, 
    isLoading, 
    handleEventUpdate 
  } = useUserEvents();
  const updatedEvent = allEvents.find(e => e.Slug === event.Slug) || event;

  if (isLoading) {
    return (
      <div className="w-full max-w-5xl mt-6">
        <LoadingSpinner />
      </div>
    );
  }

  const isSubscribed = myEvents.find(e => e.Slug === updatedEvent.Slug);

  const handleRegisterState = async () => {
    if (!handleRegister || !handleUnregister) return;
    setIsLoadingRegisterState(true);
    if (isSubscribed) await handleUnregister(updatedEvent.Slug);
    else await handleRegister(updatedEvent.Slug);
    setIsLoadingRegisterState(false);
    redirect('/events/' + updatedEvent.Slug);
  };

  return(
    <>
      {isEventCreator && (
        <>
          <Button
            onClick={() => setIsEventModalOpen(true)}
            className={cn(
              "min-w-[140px] flex items-center justify-center gap-1 p-2 rounded-sm shadow-md cursor-pointer transition-colors duration-200 font-medium", 
              "bg-accent text-secondary hover:text-accent hover:bg-secondary"
            )}
            title="Editar"
          >
            <Pencil size={18} />
            Editar
          </Button>
        </>
      )}
      <Button
        onClick={handleRegisterState}
        className={cn(
          "min-w-[140px] flex items-center justify-center gap-1 p-2 rounded-sm shadow-md cursor-pointer transition-colors duration-200 font-medium",
          isSubscribed
            ? "bg-red-500 text-white hover:text-red-500 hover:bg-white border hover:border-red-500"
            : "bg-accent text-secondary hover:text-accent hover:bg-secondary"
        )}
        title={isSubscribed ? "Cancelar inscrição" : "Inscrever-se"}
        disabled={isLoadingRegisterState}
      >
        {isSubscribed ? "Cancelar inscrição" : "Inscrever-se"}
      </Button>
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