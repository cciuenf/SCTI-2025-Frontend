import React from "react";
import {
  handleGetPublicCreatedEvents,
  handleGetUserCreatedEvents,
  handleCreateEvent
} from "@/actions/event-actions";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { UserAccessTokenJwtPayload } from "@/types/auth-interfaces";
import Link from "next/link";
import CreateEventForm from "@/components/CreateEventForm";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

type Props = {};

const Event = async (props: Props) => {
  const cookieStore = cookies();
  const access_token = (await cookieStore).get("access_token")?.value;
  const user_info = jwt.decode(
    access_token as string
  ) as UserAccessTokenJwtPayload | null;
  const events = await handleGetPublicCreatedEvents();
  const userEvents = await handleGetUserCreatedEvents();
  if (!events?.success) {
    console.error("Failed to fetch public events");
  }

  if (!userEvents?.success) {
    console.error("Failed to fetch user events");
  }

  if (!user_info) {
    console.error("Error on retrieving user infos");
  }

  return (
    <div className="flex flex-col w-4/5 mx-auto items-center justify-center gap-10 mt-10">
      <h1 className="text-accent text-3xl">Eventos gerais</h1>
      {events?.data && events?.data.length != 0 ? (
        <div className="w-full max-w-4xl mt-6">
          <h2 className="font-black text-xl mb-4">Eventos Disponíveis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events?.data.map((event) => (
              <Link
                href={`/events/${event.Slug}`}
                key={event.Slug}
                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
              >
                <h3 className="font-bold text-lg">{event.Name}</h3>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <p className="mb-10">Nenhum evento publico disponivel</p>
      )}
      <h1 className="text-accent text-3xl">Eventos do usuario especifico</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {userEvents?.data && userEvents?.data.length != 0 ? (
          userEvents.data.map((e) => (
            <Link
              href={`/events/${e.Slug}`}
              key={e.Slug}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-lg">{e.Name}</h3>
            </Link>
          ))
        ) : (
          <p className="mb-c10">Voce ainda não criou nenhum evento</p>
        )}
      </div>
      <h1 className="text-accent text-3xl">Área de Super Usuário</h1>

      {user_info && typeof user_info === 'object' && user_info.is_super && (
        <div className="w-full flex flex-col gap-5 mb-10 items-center">
          <ScrollArea className="h-72 w-4/5 shadow-2xs border-2 rounded-md border-muted text-center">
            <div className="p-8">
              <h1 className="text-2xl">Crie os seus eventos!</h1>
              <CreateEventForm
                handleCreate={handleCreateEvent}
                type="Create"
              />
            </div>
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default Event;
