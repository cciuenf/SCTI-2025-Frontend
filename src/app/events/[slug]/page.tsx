import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { UserAccessTokenJwtPayload } from "@/types/auth-interfaces";
//import CreateEventForm from "@/components/CreateEventForm";
import EventCard from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import {
  handleResgiterToEvent,
  handleUnresgiterToEvent,
  handlePromoteUserInEvent,
  handleDemoteUserInEvent,
} from "@/actions/event-actions";
import TestsButton from "@/components/TestsButton";

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

  return (
    <div className="h-screen flex flex-col items-center font-spartan p-4">
      {slug && user_info && (
        <div className="w-full flex flex-col gap-5 items-center">
          <EventCard slug={slug} user_info={user_info} />
          <div className="w-1/2 flex justify-around">
            <TestsButton
              onClick={handleResgiterToEvent}
              text="Register"
              param={slug}
            />
            <TestsButton
              onClick={handleUnresgiterToEvent}
              text="Unregister"
              param={slug}
            />
          </div>
        </div>
      )}
    </div>
  );
}
