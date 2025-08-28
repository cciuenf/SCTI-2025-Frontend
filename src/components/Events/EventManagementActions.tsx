"use client";

import { Pencil, UserPlus, UserX } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useUserEvents } from "@/contexts/UserEventsProvider";
import LoadingSpinner from "../Loading/LoadingSpinner";
import type { EventResponseI } from "@/types/event-interfaces";
import EventModalForm from "./EventModalForm";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  isEventCreator: boolean;
  isAdminStatus: { isAdmin: boolean, type: "admin" | "master_admin" | "" }
  event: EventResponseI;
}

const EventManagementActions = ({ isEventCreator, isAdminStatus, event }: Props) => {
  const [isEditEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isLoadingRegisterState, setIsLoadingRegisterState] = useState(false);
  const {
    myEvents,
    allEvents,
    handleRegister,
    handleUnregister,
    isLoading,
    handleEventUpdate,
  } = useUserEvents();
  const updatedEvent = allEvents.find((e) => e.Slug === event.Slug) || event;
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="w-full max-w-5xl mt-6">
        <LoadingSpinner />
      </div>
    );
  }

  const isSubscribed = myEvents.find((e) => e.Slug === updatedEvent.Slug);

  const handleRegisterState = async () => {
    if (!handleRegister || !handleUnregister) return;
    setIsLoadingRegisterState(true);
    if (isSubscribed) {
      await handleUnregister(updatedEvent.Slug);
    } else {
      await handleRegister(updatedEvent.Slug);
    }
    setIsLoadingRegisterState(false);
    router.push(`/events/${updatedEvent}`); // This needs to improve
  };

  return (
    <section className="w-full max-w-sm mx-auto flex flex-col items-stretch gap-3 px-4">
      <Button
        onClick={handleRegisterState}
        disabled={isLoadingRegisterState}
        title={isSubscribed ? "Cancelar inscrição" : "Inscrever-se"}
        className={cn(
          "inline-flex w-full items-center justify-center gap-2",
          "h-12 px-4 text-base font-semibold rounded-md shadow-md transition-colors",
          "disabled:opacity-60 disabled:pointer-events-none",
          isSubscribed
            ? "bg-white text-red-600 border border-red-500 hover:bg-red-50 hover:text-red-600"
            : "bg-accent text-secondary hover:text-accent hover:bg-secondary"
        )}
      >
        {isSubscribed ? <UserX className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
        {isSubscribed ? "Cancelar inscrição" : "Inscrever-se"}
      </Button>
      {(isEventCreator || isAdminStatus.type == "master_admin") && (
        <Button
          onClick={() => setIsEventModalOpen(true)}
          title="Editar evento"
          variant="outline"
          className={cn(
            "inline-flex w-full items-center justify-center gap-2",
            "h-10 px-3 text-sm font-medium rounded-md shadow-sm transition-colors",
            "text-gray-800 border border-gray-200 hover:border-accent"
          )}
        >
          <Pencil className="w-4 h-4" />
          Editar
        </Button>
      )}
      <EventModalForm
        event={updatedEvent}
        isCreating={false}
        open={isEditEventModalOpen}
        setOpen={setIsEventModalOpen}
        onEventUpdate={handleEventUpdate}
      />
    </section>
  );
};

export default EventManagementActions;
