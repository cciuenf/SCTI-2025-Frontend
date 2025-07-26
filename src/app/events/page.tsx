import {
  handleGetPublicCreatedEvents,
  handleGetUserCreatedEvents,
  handleCreateEvent,
  handleGetUserSubscribedEvents,
} from "@/actions/event-actions";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { UserAccessTokenJwtPayload } from "@/types/auth-interfaces";

import EventListSection from "@/components/Events/EventListSection";
import CreateEventForm from "@/components/CreateEventForm";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

type Props = {};

const Event = async (props: Props) => {
  const cookieStore = cookies();
  const access_token = (await cookieStore).get("access_token")?.value;
  const user_info = jwt.decode(
    access_token as string
  ) as UserAccessTokenJwtPayload | null;

  return (
    <div className="flex flex-col w-4/5 mx-auto items-center justify-center gap-10 mt-10">
      <h1 className="text-accent text-3xl">Eventos do usuário</h1>
      <EventListSection
        fetchFunction={handleGetUserSubscribedEvents}
        eventFilter="inscrito"
      />
      <h1 className="text-accent text-3xl">Eventos gerais</h1>
      <EventListSection fetchFunction={handleGetPublicCreatedEvents} />

      <h1 className="text-accent text-3xl">Área de Super Usuário</h1>

      {user_info && typeof user_info === "object" && user_info.is_super && (
        <div className="w-full flex flex-col gap-5 mb-10 items-center">
          <h1 className="text-accent text-3xl">Eventos criados pelo usuário</h1>
          <EventListSection
            fetchFunction={handleGetUserCreatedEvents}
            eventFilter="criados"
          />
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
