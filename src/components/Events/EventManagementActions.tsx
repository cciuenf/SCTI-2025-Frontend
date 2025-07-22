"use client";

import { CheckCircle, Eye, Pencil, Users } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useUserEvents } from "@/contexts/UserEventsProvider";

interface Props {
  isEventCreator: boolean;
  slug: string;
}

const EventManagementActions = ({
  isEventCreator, slug
}: Props) => {
  const { myEvents } = useUserEvents();
  const isSubscribed = myEvents.find(e => e.Slug === slug);
  return(
    <>
      {isEventCreator && (
        <>
          <Button
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
          </Button>

          <Button
            // onClick={onEdit}
            className="flex-none p-2 rounded-sm shadow-md cursor-pointer transition-colors duration-200 bg-accent text-secondary font-medium hover:text-accent hover:bg-secondary"
            title="Editar"
          >
            <Pencil size={18} />
            <span className="hidden sm:inline ml-1">Editar</span>
          </Button>
        </>
      )}

      {/* {(onRegister && onUnregister) && ( */}
        <Button
          // onClick={handleRegisterState}
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
      {/* )} */}
    </>
  )
}

export default EventManagementActions;