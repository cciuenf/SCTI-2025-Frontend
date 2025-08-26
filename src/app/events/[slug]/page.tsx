import { handleGetSlugCreatedEvent } from "@/actions/event-actions";
import EventManagementActions from "@/components/Events/EventManagementActions";
import EventSlugTabManager from "@/components/Events/Slug/EventSlugTabManager";
import Connector from "@/components/ui/Generic/Connector";
import { getAdminStatus, getUserInfo } from "@/lib/cookies";
import { formatEventDateRange, normalizeDate } from "@/lib/date-utils";
import { Calendar, MapPin, Users } from "lucide-react";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

const SlugEventPage = async (props: Props) => {
  const { slug } = await props.params;
  if (slug.toUpperCase() !== "SCTI") redirect("/events/scti");

  const user_info = await getUserInfo();
  const user_admin_status = await getAdminStatus();
  const isEventCreator =
    user_info?.is_event_creator || user_info?.is_super || false;

  const eventRes = await handleGetSlugCreatedEvent(slug);
  if (!eventRes || !eventRes.data) redirect("/events");

  return (
    <Connector className="flex flex-col mx-auto items-center justify-center !mt-20 text-center">
      <h1 className="xl:text-6xl text-4xl font-bold mt-20">
        {eventRes?.data.Name}
      </h1>
      <div className="w-full flex mt-4 mb-6 justify-center items-center flex-col gap-2 xs:flex-row xs:gap-10 px-4 text-sm">
        <p className="flex items-center gap-2">
          <Calendar className="text-accent" size={16} />
          {formatEventDateRange(
            normalizeDate(eventRes?.data.start_date),
            normalizeDate(eventRes?.data.end_date)
          )}
        </p>
        <p className="flex items-center gap-2">
          <MapPin className="text-accent" size={16} /> {eventRes?.data.location}
        </p>
        <p className="flex items-center gap-2">
          <Users className="text-accent" size={16} />{" "}
          {eventRes?.data.participant_count || 0} participantes
        </p>
      </div>
      <h2 className="xl:text-3xl text-lg text-secondary font-bold mt-2">
        Sobre o Evento
      </h2>
      <p className="text-center max-w-[80%] font-light mt-2">
        {eventRes?.data.description}
      </p>
      <div className="flex flex-wrap justify-center gap-4 px-2 my-6">
        {eventRes?.data && (
          <EventManagementActions
            isEventCreator={isEventCreator}
            event={eventRes.data}
          />
        )}
      </div>
      <h2 className="xl:text-3xl text-lg text-secondary font-bold mt-2 mb-6">
        Atividades
      </h2>
      <div className="w-full max-w-6xl px-4">
        {eventRes?.data && user_info && (
          <ActivityListSection
            isAdminStatus={user_admin_status}
            isEventCreator={isEventCreator}
            currentEvent={{ id: eventRes.data.ID, slug: slug }}
            user_id={user_info.id}
          />
        )}
      </div>
      <h2 className="xl:text-3xl text-lg text-secondary font-bold mt-2 mb-6">
        Produtos
      </h2>
      <div className="w-full max-w-6xl px-4">
        {eventRes?.data && (
          <ProductListSection
            currentEvent={{ id: eventRes.data.ID, slug: slug }}
            isEventCreator={isEventCreator}
            isAdminStatus={user_admin_status}
          />
        )}
      </div>
      <EventSlugTabManager
        isEventCreator={isEventCreator}
        eventId={eventRes.data.ID}
        slug={slug}
        userId={user_info?.id || ""}
      />
    </Connector>
  );
};

export default SlugEventPage;
