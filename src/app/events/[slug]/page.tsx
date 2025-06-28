import { cookies } from "next/headers";

interface EventPageProps { params: { slug: string; } }
import jwt from "jsonwebtoken";
import { UserAccessTokenJwtPayload } from "@/types/auth-interfaces";
import ProductListSection from "@/components/Products/ProductListSection";
import CreateEventForm from "@/components/CreateEventForm";
import EventSummary from "@/components/EventSummary";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  handleGetSlugCreatedEvent,
  handleUpdateSlugCreatedEvents,
} from "@/actions/event-actions";
import { EventResponseI } from "@/types/event-interfaces";
import PromoteDemoteForm from "@/components/PromoteDemoteForm";

interface EventPageProps {
  params: {
    slug: string;
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const cookieStore = cookies();
  const access_token = (await cookieStore).get("access_token")?.value;
  const user_info = jwt.decode(
    access_token as string
  ) as UserAccessTokenJwtPayload | null;
  const { slug } = await params;

  const transformEventData = (data: EventResponseI) => {
    return {
      id: data.ID,
      name: data.Name,
      slug: data.Slug,
      description: data.description,
      location: data.location,
      start_date: data.start_date,
      end_date: data.end_date,
      is_blocked: data.is_blocked,
      is_hidden: data.is_hidden,
      max_tokens_per_user: data.max_tokens_per_user,
    };
  };

  const currentEvent = await handleGetSlugCreatedEvent(slug);
  const toUpdateEvent = currentEvent
    ? transformEventData(currentEvent.data)
    : null;

  return (
    <div className="h-screen flex flex-col items-center font-spartan p-4">
      {slug && user_info && (
        <div className="w-full flex flex-col gap-5 items-center">
          <EventSummary slug={slug} user_info={user_info} />
          <div className="w-1/2 flex justify-around">
          </div>
        </div>
      )}
      {user_info && typeof user_info === "object" && user_info.is_super && (
        <div className="w-full flex flex-col gap-5 my-10 items-center">
          <h1 className="text-accent text-3xl">Área de Super User</h1>
          <ScrollArea className="h-72 w-4/5 shadow-2xs border-2 rounded-md border-muted text-center">
            <div className="p-8">
              <h1 className="text-2xl">Atualize o seu evento!</h1>
              <CreateEventForm
                slug={slug}
                event={toUpdateEvent}
                handleUpdate={handleUpdateSlugCreatedEvents}
                type="Update"
              />
            </div>
            <ScrollBar orientation="vertical" />
          </ScrollArea>
          <PromoteDemoteForm
          slug={slug}
          />
          {toUpdateEvent && (<ProductListSection currentEvent={toUpdateEvent}/>)}
        </div>
      )}
    </div>
  );
}
