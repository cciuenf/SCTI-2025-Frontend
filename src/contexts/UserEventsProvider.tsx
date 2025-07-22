"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { EventResponseI } from "@/types/event-interfaces";
import { toast } from "sonner";
import { handleDeleteSlugCreatedEvents, handleGetEvents, handleGetUserSubscribedEvents, handleRegisterFromEvent, handleUnresgiterFromEvent } from "@/actions/event-actions";

interface UserEventsContextData {
  allEvents: EventResponseI[];
  myEvents: EventResponseI[];
  loading: boolean;
  refreshEvents: () => Promise<void>;
  handleEventCreate: (newEvent: EventResponseI) => void;
  handleEventUpdate: (updatedEvent: EventResponseI) => void;
  handleEventDelete: (slug: string) => Promise<void>;
  handleRegister: (slug: string) => Promise<void>;
  handleUnregister: (slug: string) => Promise<void>;
}

const UserEventsContext = createContext<UserEventsContextData | undefined>(undefined);

export const UserEventsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allEvents, setAllEvents] = useState<EventResponseI[]>([]);
  const [myEvents, setMyEvents] = useState<EventResponseI[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const [allEventsData, myEventsData] = await Promise.all([
        handleGetEvents(),
        handleGetUserSubscribedEvents(),
      ]);
      setAllEvents(allEventsData?.data || []);
      setMyEvents(myEventsData?.data || []);
    } catch (error) {
      console.error("Erro ao carregar eventos:", error);
      toast.error("Erro ao carregar eventos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleEventCreate = useCallback((newEvent: EventResponseI) => {
    setAllEvents(prevEvents => [...prevEvents, newEvent]);
  }, []);

  const handleEventUpdate = useCallback((updatedEvent: EventResponseI) => {
    setAllEvents(prevEvents =>
      prevEvents.map(e => e.ID === updatedEvent.ID ? updatedEvent : e)
    );
    setMyEvents(prevEvents =>
      prevEvents.map(e => e.ID === updatedEvent.ID ? updatedEvent : e)
    );
  }, []);

  const handleEventDelete = useCallback(async (slug: string) => {
    const res = await handleDeleteSlugCreatedEvents(slug);
    if (res.success) {
      setAllEvents(prevEvents => prevEvents.filter(e => e.Slug !== slug));
      setMyEvents(prevEvents => prevEvents.filter(e => e.Slug !== slug));
      toast.success("Evento apagado com sucesso!");
    } else {
      toast.error("Erro ao apagar o evento");
    }
  }, []);

  const handleRegister = useCallback(async (slug: string) => {
    const res = await handleRegisterFromEvent(slug);
    if (res.success) {
      const event = allEvents.find(e => e.Slug === slug);
      if (event && !myEvents.some(e => e.Slug === slug)) {
        setMyEvents(prev => [...prev, event]);
        toast.success("Inscrição realizada com sucesso!");
      }
    } else {
      toast.error("Erro ao se inscrever no evento");
    }
  }, [allEvents, myEvents]);

  const handleUnregister = useCallback(async (slug: string) => {
    const res = await handleUnresgiterFromEvent(slug);
    if (res.success) {
      setMyEvents(prev => prev.filter(e => e.Slug !== slug));
      toast.success("Inscrição cancelada com sucesso!");
    } else {
      toast.error("Erro ao cancelar inscrição no evento");
    }
  }, [allEvents, myEvents]);

  return (
    <UserEventsContext.Provider value={{
      allEvents,
      myEvents,
      loading,
      refreshEvents: fetchEvents,
      handleEventCreate,
      handleEventUpdate,
      handleEventDelete,
      handleRegister,
      handleUnregister,
    }}>
      {children}
    </UserEventsContext.Provider>
  );
};


export function useUserEvents() {
  const context = useContext(UserEventsContext);
  if (!context) throw new Error("useUserEvents must be used within a UserEventsProvider");
  return context;
}
