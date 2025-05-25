import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { UserAccessTokenJwtPayload } from "@/types/auth-interfaces";
import CreateEventForm from "@/components/CreateEventForm";
import {
  handleGetSlugCreatedEvents,
} from "@/actions/event-actions";
import EventCard from "@/components/EventCard";

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
  const currentEvent = await handleGetSlugCreatedEvents(slug);

  return (
    <div className="h-screen flex flex-col items-center font-spartan p-4">
      {/*currentEvent ? <p className="mb-4">Nome do evento: {currentEvent?.data.Name}</p> :  <></>*/}
      <EventCard slug={slug} user_info={user_info!} />
      <div className="w-7/10 shadow-xs my-10">
        <CreateEventForm />
      </div>
    </div>
  );
}
