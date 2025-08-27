import { handleGetSlugCreatedEvent } from "@/actions/event-actions";
import EventManagementActions from "@/components/Events/EventManagementActions";
import EventSlugTabManager from "@/components/Events/Slug/EventSlugTabManager";
import { getUserInfo } from "@/lib/cookies";
import { formatEventDateRange, normalizeDate } from "@/lib/date-utils";
import { cn } from "@/lib/utils";
import { Calendar, MapPin, Users } from "lucide-react";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

const SlugEventPage = async (props: Props) => {
  const { slug } = await props.params;
  if (slug.toUpperCase() !== "SCTI") redirect("/events/scti");

  const user_info = await getUserInfo()
  const isEventCreator = user_info?.is_event_creator || user_info?.is_super || false;

  const eventRes = await handleGetSlugCreatedEvent(slug);
  if (!eventRes || !eventRes.data) redirect("/events");

  const cardCls = cn(
    "group flex flex-col items-center justify-center p-4 h-36 flex-1 min-w-52",
    "rounded-xl border border-gray-200 bg-gray-50",
    "hover:bg-gray-100 hover:shadow-sm",
    "focus-within:ring-2 focus-within:ring-accent/40 focus-within:border-accent",
    "transition-all duration-300"
  );

  const iconCls = "w-9 h-9 p-1.5 rounded-full bg-accent/90 text-secondary mb-2";
  const titleCls = "text-[11px] font-semibold text-amber-600 uppercase tracking-wider mb-1";
  const valueCls = "text-sm font-bold text-secondary text-center";

  return (
    <div className="flex flex-col items-center justify-center text-center min-h-screen h-full">
      <div className="max-w-5xl mx-auto mt-8 text-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 leading-tight text-secondary">
          {eventRes?.data.Name}
        </h1>
        <hr className="w-24 border-2 border-accent mx-auto rounded-full"/>
      </div>
      <section
        aria-label="Destaques do evento"
        className="mx-auto mt-6 mb-8 max-w-4xl px-2"
      >
        <dl className="flex flex-wrap justify-center gap-3">
          <div className={cardCls} tabIndex={0} role="group" aria-label="Data do evento">
            <Calendar className={iconCls} aria-hidden />
            <dt className={titleCls}>Data</dt>
            <dd className={valueCls}>{formatEventDateRange(normalizeDate(eventRes?.data.start_date), normalizeDate(eventRes?.data.end_date))}</dd>
          </div>

          <div className={cardCls} tabIndex={0} role="group" aria-label="Local do evento">
            <MapPin className={iconCls} aria-hidden />
            <dt className={titleCls}>Local</dt>
            <dd className={cn(valueCls, "line-clamp-2")}>{eventRes.data.location}</dd>
          </div>

          <div className={cardCls} tabIndex={0} role="group" aria-label="Participantes">
            <Users className={iconCls} aria-hidden />
            <dt className={titleCls}>Participantes</dt>
            <dd className={`${valueCls} !text-lg`}>{eventRes.data.participant_count || 0}</dd>
          </div>
        </dl>
      </section>
      <EventManagementActions isEventCreator={isEventCreator} event={eventRes.data}/>
      <section className="max-w-3xl mx-auto px-4 container my-8">
        <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-3">Sobre o Evento</h2>
        <hr className="w-12 border-2 border-accent mx-auto rounded-full"/>
        <div className="bg-white rounded-lg p-6 mt-6 shadow-sm border border-gray-200">
          <p className="text-slate-600 text-base leading-relaxed text-justify">
            {eventRes.data.description}
          </p>
        </div>
      </section>
      <EventSlugTabManager 
        isEventCreator={isEventCreator}
        eventId={eventRes.data.ID}
        slug={slug}
        userId={user_info?.id || ""}
      />
    </div>
  );
};

export default SlugEventPage;
