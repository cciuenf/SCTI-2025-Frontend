import { UserAccessTokenJwtPayload } from "@/types/auth-interfaces";
import React from "react";
import { handleDeleteSlugCreatedEvents } from "@/actions/event-actions";
import { handleGetSlugCreatedEvent } from "@/actions/event-actions";
import DeleteTrashButton from "./DeleteTrashButton";
type Props = {
  slug: string;
  user_info: UserAccessTokenJwtPayload;
};

const EventCard = async ({ slug, user_info }: Props) => {
  // const currentEvent = await handleGetSlugCreatedEvent(slug);

  //  {currentEvent ? (
  //   <h1 className="font-black text-2xl mb-6">Evento: {currentEvent?.data.Name}</h1>

  //   ) : (<></>)}

  return (
    <div className="w-4/5 max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg p-6 flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="font-black text-2xl mb-6">Evento: {slug}</h1>
          <h2 className="text-xl font-bold mb-4">Informações do Evento</h2>
          <p className="mb-4">Slug: {slug}</p>

          <p className="mb-4">
            Usuário: {user_info?.name} {user_info?.last_name}
          </p>
        </div>
        {user_info?.is_super && (
          <DeleteTrashButton
            deleteFunction={handleDeleteSlugCreatedEvents}
            uniqueParam={slug}
          />
        )}
      </div>
    </div>
  );
};

export default EventCard;
