import React from "react";
import {
  handleGetPublicCreatedEvents,
  handleGetUserCreatedEvents,
} from "@/actions/event-actions";

import Link from "next/link";
import CreateEventModal from "@/components/CreateEventModal";
import CreateEventForm from "@/components/CreateEventForm";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

type Props = {};

const Event = async (props: Props) => {
  const events = await handleGetPublicCreatedEvents();
  const userEvents = await handleGetUserCreatedEvents();
  if (!events?.success) {
    console.error("Failed to fetch public events");
  }

  if (!userEvents?.success) {
    console.error("Failed to fetch user events");
  }
  return (
    <div className="flex flex-col w-4/5 mx-auto items-center justify-center gap-10 mt-10">
      <ScrollArea className="h-72 w-4/5 shadow-2xs border-2 rounded-md border-muted text-center">
        <div className="p-8">
          <h1 className="text-2xl">Crie os seus eventos!</h1>
          <CreateEventForm />
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
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
                <p className="text-gray-600">Slug: {event.Slug}</p>
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
              <p className="text-gray-600">Slug: {e.Slug}</p>
            </Link>
          ))
        ) : (
          <p className="mb-10">Voce ainda não criou nenhum evento</p>
        )}
      </div>
    </div>
  );
};

export default Event;
