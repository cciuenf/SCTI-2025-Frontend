import {
  handleGetPublicCreatedEvents,
  handleGetUserCreatedEvents,
  handleCreateEvent,
  handleGetUserSubscribedEvents,
  handleResgiterFromEvent,
  handleUnresgiterFromEvent,
} from "@/actions/event-actions";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { UserAccessTokenJwtPayload } from "@/types/auth-interfaces";

import EventCard from "@/components/EventCard";
import TestsButton from "@/components/TestsButton";
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
  const userCreatedEvents = await handleGetUserCreatedEvents();
  const userSubscribedEvents = await handleGetUserSubscribedEvents();

  if (!events?.success) {
    console.error("Failed to fetch public events");
  }

  if (!userCreatedEvents?.success) {
    console.error("Failed to fetch user events");
  }

  if (!userSubscribedEvents?.success) {
    console.error("Failed to fetch user subscribed events");
  }

  if (!user_info) {
    console.error("Error on retrieving user infos");
  }

  return (
    <div className="flex flex-col w-4/5 mx-auto items-center justify-center gap-10 mt-10">
      <h1 className="text-accent text-3xl">Eventos gerais</h1>
      {events?.data && events?.data.length != 0 ? (
        <div className="w-full max-w-4xl mt-6">
          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-4">
            {events?.data.map((e) => (
              <EventCard
                key={e.Slug}
                slug={e.Slug}
                name={e.Name}
                local={e.location}
                actionButton={
                  <TestsButton
                    onClick={handleResgiterFromEvent}
                    text="Register"
                    param={e.Slug}
                  />
                }
                start_date={e.start_date}
                end_date={e.end_date}
              />
            ))}
          </div>
        </div>
      ) : (
        <p className="mb-10">Nenhum evento publico disponivel</p>
      )}

      <h1 className="text-accent text-3xl">Eventos do usuário</h1>
      {userSubscribedEvents?.data && userSubscribedEvents?.data.length != 0 ? (
        <div className="w-full max-w-4xl mt-6">
          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-4">
            {userSubscribedEvents.data.map((e) => (
              <EventCard
                key={e.Slug}
                slug={e.Slug}
                name={e.Name}
                local={e.location}
                actionButton={
                  <TestsButton
                    onClick={handleUnresgiterFromEvent}
                    text="Unregister"
                    param={e.Slug}
                  />
                }
                start_date={e.start_date}
                end_date={e.end_date}
              />
            ))}
          </div>
        </div>
      ) : (
        <p className="mb-10">Voce ainda não se inscreveu em nenhum evento</p>
      )}

      <h1 className="text-accent text-3xl">Eventos criados pelo usuário</h1>
      {userCreatedEvents?.data && userCreatedEvents?.data.length != 0 ? (
        <div className="w-full max-w-4xl mt-6">
          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-4">
            {userCreatedEvents.data.map((e) => (
              <EventCard
                key={e.Slug}
                slug={e.Slug}
                name={e.Name}
                local={e.location}
                start_date={e.start_date}
                end_date={e.end_date}
                actionButton={undefined}
              />
            ))}
          </div>
        </div>
      ) : (
        <p className="mb-10">Voce ainda não criou nenhum evento</p>
      )}
      <h1 className="text-accent text-3xl">Área de Super Usuário</h1>

      {user_info && typeof user_info === "object" && user_info.is_super && (
        <div className="w-full flex flex-col gap-5 mb-10 items-center">
          <ScrollArea className="h-72 w-4/5 shadow-2xs border-2 rounded-md border-muted text-center">
            <div className="p-8">
              <h1 className="text-2xl">Crie os seus eventos!</h1>
              <CreateEventForm handleCreate={handleCreateEvent} type="Create" />
            </div>
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default Event;
