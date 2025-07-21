"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import EventCard from "./EventCard";
import {
  handleGetEvents,
  handleGetUserSubscribedEvents,
  handleRegisterFromEvent,
  handleUnresgiterFromEvent,
} from "@/actions/event-actions";
import { EventResponseI } from "@/types/event-interfaces";
import CardSkeleton from "../Loading/CardSkeleton";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

const EventListSection = (props: { isEventCreator: boolean }) => {
  const [currentView, setCurrentView] = useState<string>("all");
  const [allEvents, setAllEvents] = useState<EventResponseI[]>([]);
  const [myEvents, setMyEvents] = useState<EventResponseI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const [allEventsData, myEventsData] = await Promise.all([
          handleGetEvents(),
          handleGetUserSubscribedEvents()
        ]);

        setAllEvents(allEventsData?.data || []);
        setMyEvents(myEventsData?.data || []);
      } catch (error) {
        console.error("Erro ao carregar eventos:", error);
        toast.error("Erro ao carregar eventos");
      } finally { setLoading(false); }
    };

    fetchEvents();
  }, []);

  const currentData = currentView === "all" ? allEvents : myEvents;

  if (loading) {
    return (
      <div className="w-full max-w-5xl mt-6">
        <div className="flex w-full gap-2 mb-6">
          <div className="flex-1 bg-white rounded-lg shadow-md h-10 flex items-center justify-center animate-pulse" />
          <div className="flex-1 bg-white rounded-lg shadow-md h-10 flex items-center justify-center animate-pulse" />
        </div>
        <CardSkeleton count={6} />
      </div>
    );
  }

  const handleRegister = async (slug: string) => {
    const res = await handleRegisterFromEvent(slug);
    if (res.success) {
      const event = allEvents.find(e => e.Slug === slug);
      if (event && !myEvents.some(e => e.Slug === slug)) {
        setMyEvents(prev => [...prev, event]);
        toast.success("Inscrição realizada com sucesso!");
      }
    } else toast.error("Erro ao se inscrever no evento");
  };

  const handleUnregister = async (slug: string) => {
    const res = await handleUnresgiterFromEvent(slug);
    if (res.success) {
      setMyEvents(prev => prev.filter(e => e.Slug !== slug));
      toast.success("Inscrição cancelada com sucesso!");
    } else toast.error("Erro ao cancelar inscrição no evento");
  };

  return (
    <>
      <div 
        className={cn(
          "flex items-center justify-around relative",
          "border-1 border-secondary bg-secondary rounded-md p-0.5",
          "gap-0.5 sm:gap-1"
        )}
      >
        <div
          className={cn(
            "flex-1 flex items-center justify-center gap-1 sm:gap-2 cursor-pointer",
            "py-1 px-0.5 sm:py-2 sm:px-1 duration-300 transition-colors rounded-md",
            "hover:bg-white hover:text-secondary hover:font-semibold",
            "text-xs sm:text-base text-white",
            currentView === "my" && "bg-zinc-100 text-secondary font-semibold"
          )}
          onClick={() => setCurrentView("my")}
        >
          <h2 className={cn(currentView !== "my" && "opacity-80")}>Meus Eventos</h2>
        </div>
        <Plus 
          className={cn(
            "absolute h-full w-auto rounded-full p-2 scale-125 cursor-pointer",
            "text-white bg-accent shadow-md z-10 transition-all",
            "hover:text-accent hover:bg-secondary hover:scale-[140%]"
          )}
        />
        <div
          className={cn(
            "flex-1 flex items-center justify-center gap-1 sm:gap-2 cursor-pointer",
            "py-1 px-0.5 sm:py-2 sm:px-1 duration-300 transition-colors rounded-md",
            "hover:bg-white hover:text-secondary hover:font-semibold",
            "text-xs sm:text-base text-white",
            currentView === "all" && "bg-zinc-100 text-secondary font-semibold"
          )}
          onClick={() => setCurrentView("all")}
        >
          <h2 className={cn(currentView !== "all" && "opacity-80")}>Todos os Eventos</h2>
        </div>
      </div>

      {currentData?.length !== 0 ? (
        <div className="w-full max-w-5xl mt-6 mb-6">
          <div className="grid justify-center md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentData?.map((e) => (
              <EventCard
                key={e.Slug}
                slug={e.Slug}
                name={e.Name}
                local={e.location}
                start_date={e.start_date}
                end_date={e.end_date}
                description={e.description}
                isEventCreator={props.isEventCreator}
                isSubscribed={myEvents.some(ev => ev.Slug === e.Slug)}
                onRegister={handleRegister}
                onUnregister={handleUnregister}
              />
            ))}
          </div>
        </div>
      ) : (
        <p className="mt-6 mb-10">Sem eventos disponíveis nessa seção</p>
      )}
    </>
  );
};

export default EventListSection;
