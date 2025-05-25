"use client";
import { UserAccessTokenJwtPayload } from "@/types/auth-interfaces";
import React from "react";
import { Trash } from "lucide-react";
import { handleDeleteSlugCreatedEvents } from "@/actions/event-actions";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import { Button } from "./ui/button";
type Props = {
  slug: string;
  user_info: UserAccessTokenJwtPayload;
};

const EventCard = ({ slug, user_info }: Props) => {
  return (
    <div className="w-4/5 max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg p-6 flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="font-black text-2xl mb-6">Evento: {slug}</h1>
          <h2 className="text-xl font-bold mb-4">Informações do Evento</h2>
          <p className="mb-4">Slug: {slug}</p>
          {/*currentEvent ? <p className="mb-4">Nome do evento: {currentEvent?.data.Name}</p> :  <></>*/}
          <p className="mb-4">
            Usuário: {user_info?.name} {user_info?.last_name}
          </p>
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Trash className="w-7 h-7 p-1 rounded-md cursor-pointer bg-destructive text-popover hover:text-destructive hover:bg-transparent duration-300 " />
          </PopoverTrigger>
          <PopoverContent side="left" className="w-80 h-28" sideOffset={12}>
            <div className="w-full rounded-md flex flex-col items-center justify-around">
              <p className="text-sm">
                Tem certeza que deseja apagar esse evento?
              </p>
              <div className="flex justify-around items-center w-full">
                <Button
                  variant={"destructive"}
                  onClick={() => handleDeleteSlugCreatedEvents(slug)}
                >
                  Sim
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default EventCard;
