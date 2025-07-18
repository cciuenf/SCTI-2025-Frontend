import { getUserInfo } from "@/lib/cookies";
import { redirect } from "next/navigation";

const EventsPage = async () => {
  const user_info = await getUserInfo()
  if (!user_info?.is_event_creator || !user_info?.is_super) redirect("/events/scti");

  return (
    <div className="flex flex-col mx-auto items-center justify-center mt-10">
      <h1 className="text-6xl font-bold">Eventos da Semana</h1>
      <p className="text-sm">
        Gerencie sua participação nos eventos e explore novos eventos disponíveis.
      </p>
    </div>
  );
};

export default EventsPage;