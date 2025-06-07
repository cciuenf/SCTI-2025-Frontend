"use client";
import { UserAccessTokenJwtPayload } from "@/types/auth-interfaces";
import {useEffect, useState} from "react";
import {
  handleDeleteSlugCreatedEvents,
  handleGetSlugCreatedEvent,
  handleUnresgiterFromEvent,
  handleRegisterFromEvent,
} from "@/actions/event-actions";

import { Button } from "./ui/button";
import DeleteTrashButton from "./DeleteTrashButton";
import { EventResponseI } from "@/types/event-interfaces";

type Props = {
  slug: string;
  user_info: UserAccessTokenJwtPayload;
};

const EventSummary = ({ slug, user_info }: Props) => {
  const [currentEvent, setCurrentEvent] = useState<EventResponseI>()

  const fetchEvent = async () => {
    const event = await handleGetSlugCreatedEvent(slug)
    if (event?.success) {
      setCurrentEvent(event.data)
    }
  }

  useEffect(() => {
    fetchEvent()
  }, [])

  return (
    <div className="w-4/5 max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg p-6 flex-col justify-between items-center relative">
        <h1 className="text-xl font-black mb-4">Informações do Evento</h1>
        <div className="flex flex-col gap-4">
          <h2 className="font-bold text-2xl">
            Nome do Evento: {currentEvent?.Name}
          </h2>
          <h2>Descrição do Evento: {currentEvent?.description}</h2>
          <h2>Local do Evento: {currentEvent?.location}</h2>
        </div>

        <p className="my-4">Slug: {slug}</p>
        <p className="my-4">
          Usuário Criador: {user_info?.name} {user_info?.last_name}
        </p>
        <div className="flex justify-around w-3/5 mx-auto">
          <Button onClick={() => handleUnresgiterFromEvent(slug)}>
            Desinscrever-se
          </Button>

          <Button onClick={() => handleRegisterFromEvent(slug)}>
            Inscrever-se
          </Button>
        </div>
        {user_info?.is_super && (
          <DeleteTrashButton
            deleteFunction={handleDeleteSlugCreatedEvents}
            uniqueParam={slug}
            position="bottom-3 right-3"
          />
        )}
      </div>
    </div>
  );
};

export default EventSummary;
