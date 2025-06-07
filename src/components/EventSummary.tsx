import { UserAccessTokenJwtPayload } from "@/types/auth-interfaces";
import React from "react";
import { handleDeleteSlugCreatedEvents } from "@/actions/event-actions";
import { handleGetSlugCreatedEvent } from "@/actions/event-actions";
import DeleteTrashButton from "./DeleteTrashButton";
type Props = {
  slug: string;
  user_info: UserAccessTokenJwtPayload;
};

const EventSummary = async ({ slug, user_info }: Props) => {
  const currentEvent = await handleGetSlugCreatedEvent(slug);

  return (
    <div className="w-4/5 max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg p-6 flex-col justify-between items-center relative">
        <h1 className="text-xl font-black mb-4">Informações do Evento</h1>
        <div className="flex flex-col gap-4">
          <h2 className="font-bold text-2xl">
            Nome do Evento: {currentEvent?.data.Name}
          </h2>
          <h2>Descrição do Evento: {currentEvent?.data.description}</h2>
          <h2>Local do Evento: {currentEvent?.data.location}</h2>
        </div>

        <p className="my-4">Slug: {slug}</p>
        <p>
          Usuário Criador: {user_info?.name} {user_info?.last_name}
        </p>
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
