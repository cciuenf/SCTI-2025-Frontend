import { handleGetSlugCreatedEvent } from "@/actions/event-actions";
import ActivityListSection from "@/components/Activities/ActivityListSection";
import EventManagementActions from "@/components/Events/EventManagementActions";
import ProductListSection from "@/components/Products/ProductListSection";
import { getUserInfo } from "@/lib/cookies";
import { formatEventDateRange } from "@/lib/utils";
import { Calendar, MapPin, Users } from "lucide-react";
import { redirect } from "next/navigation";

type Props = {
  params: {
    slug: string;
  };
};

const SlugEventPage = async (props: Props) => {
  const { slug } = await props.params;
  if (slug.toUpperCase() !== "SCTI") redirect("/events/scti");

  const user_info = await getUserInfo()
  const isEventCreator = user_info?.is_event_creator || user_info?.is_super || false;

  const eventRes = await handleGetSlugCreatedEvent(slug);
  console.log(eventRes?.data.ID)

  return (
    <div className="flex flex-col mx-auto items-center justify-center mt-10">
      <h1 className="xl:text-6xl text-4xl font-bold">{ eventRes?.data.Name }</h1>
      <div className="w-full flex mt-4 mb-6 justify-center items-center flex-col gap-2 xs:flex-row xs:gap-10 px-4 text-sm">
        <p className="flex items-center gap-2">
          <Calendar className="text-accent" size={16} />
          {formatEventDateRange(eventRes?.data.start_date || new Date(), eventRes?.data.end_date || new Date())}
        </p>
        <p className="flex items-center gap-2">
          <MapPin className="text-accent" size={16} /> {eventRes?.data.location}
        </p>
        <p className="flex items-center gap-2">
          <Users className="text-accent" size={16} /> 80 participantes
        </p>
      </div>
      <h2 className="xl:text-3xl text-lg text-secondary font-bold mt-2">Sobre o Evento</h2>
      <p className="text-center max-w-[80%] font-light mt-2">{ eventRes?.data.description }</p>
      <div className="flex flex-wrap justify-center gap-4 px-2 my-6">
        {eventRes?.data && <EventManagementActions isEventCreator={isEventCreator} event={eventRes.data}/> }
      </div>
      <h2 className="xl:text-3xl text-lg text-secondary font-bold mt-2 mb-6">Atividades</h2>
      <div className="w-full max-w-4xl px-4">
        {eventRes?.data && user_info &&
          <ActivityListSection
            isEventCreator={isEventCreator}
            currentEvent={{id: eventRes.data.ID, slug: slug}}
            user_id={user_info.id}
          />
        }
      </div>
      <h2 className="xl:text-3xl text-lg text-secondary font-bold mt-2 mb-6">Produtos</h2>
      <div className="w-full max-w-4xl px-4">
        {eventRes?.data &&
          <ProductListSection
            currentEvent={{id: eventRes.data.ID, slug: slug}}
            isEventCreator={isEventCreator}
          />
        }
      </div>
    </div>
  );
};

export default SlugEventPage;
