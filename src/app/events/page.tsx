import { getUserInfo } from "@/lib/cookies";
import { redirect } from "next/navigation";
import EventListSection from "@/components/Events/EventListSection";
import Connector from "@/components/ui/Generic/Connector";


const EventsPage = async () => {
  const user_info = await getUserInfo()
  const isEventCreator = user_info?.is_event_creator || user_info?.is_super;
  if (!isEventCreator) redirect("/events/scti");

  return (
    <Connector className="flex flex-col mx-auto items-center justify-center !mt-20 text-center">
      <h1 className="text-6xl font-bold">Eventos da Semana</h1>
      <h3 className="text-md text-center font-light max-w-[760px] mb-8">
        Gerencie sua participação nos eventos e explore novos eventos disponíveis.
      </h3>
      <div className="w-full max-w-4xl px-4">
        <EventListSection isEventCreator={isEventCreator}/>
      </div>
    </Connector>
  );
};

export default EventsPage;