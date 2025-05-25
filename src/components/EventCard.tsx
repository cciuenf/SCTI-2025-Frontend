"use client";
import { UserAccessTokenJwtPayload } from "@/types/auth-interfaces";
import React from "react";
import { Trash } from "lucide-react";
import { handleDeleteSlugCreatedEvents } from "@/actions/event-actions";
type Props = {
  slug: string;
  user_info: UserAccessTokenJwtPayload;
};

const EventCard = ({ slug, user_info }: Props) => {
  return (
    <div className="w-full max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="font-black text-2xl mb-6">Evento: {slug}</h1>
        <h2 className="text-xl font-bold mb-4">Informações do Evento</h2>
        <p className="mb-4">Slug: {slug}</p>
        {/*currentEvent ? <p className="mb-4">Nome do evento: {currentEvent?.data.Name}</p> :  <></>*/}
        <p className="mb-4">
          Usuário: {user_info?.name} {user_info?.last_name}
        </p>

        <Trash
          className="cursor-pointer hover:text-accent duration-100 "
          onClick={() => handleDeleteSlugCreatedEvents(slug)}
        />
      </div>
    </div>
  );
};

export default EventCard;
