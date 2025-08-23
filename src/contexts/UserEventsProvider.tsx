"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { EventResponseI } from "@/types/event-interfaces";
import { toast } from "sonner";
import { 
  handleDeleteSlugCreatedEvents, 
  handleDemoteUserInEvent, 
  handleGetEvents, 
  handleGetUserSubscribedEvents, 
  handlePromoteUserInEvent, 
  handleRegisterFromEvent, 
  handleUnresgiterFromEvent 
} from "@/actions/event-actions";
import { runWithToast } from "@/lib/client/run-with-toast";

interface UserEventsContextData {
  allEvents: EventResponseI[];
  myEvents: EventResponseI[];
  isLoading: boolean;
  refreshEvents: () => Promise<void>;
  handleEventCreate: (newEvent: EventResponseI) => void;
  handleEventUpdate: (updatedEvent: EventResponseI) => void;
  handleEventDelete: (slug: string) => Promise<void>;
  handleRegister: (slug: string) => Promise<void>;
  handleUnregister: (slug: string) => Promise<void>;
  handleUserEventRole: (slug: string, email: string, willPromote: boolean) => Promise<void>;
}

const UserEventsContext = createContext<UserEventsContextData | undefined>(undefined);

export const UserEventsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allEvents, setAllEvents] = useState<EventResponseI[]>([]);
  const [myEvents, setMyEvents] = useState<EventResponseI[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEvents = async () => {
    const id = toast.loading('Carregando Eventos...');
    const [allEventsData, myEventsData] = await Promise.all([
      handleGetEvents(),
      handleGetUserSubscribedEvents(),
    ]);
    setAllEvents(allEventsData.data || []);
    setMyEvents(myEventsData.data || []);

    if (allEventsData.success && myEventsData.success)
      toast.success('Eventos carregados com sucesso!', { id });
    else if(!allEventsData.success && !myEventsData.success) 
      toast.error("Erro ao carregar os eventos", { id });
    else toast.error('Falha ao carregar algum dos eventos', { id });
    setIsLoading(false);
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
    const res = await runWithToast(
      handleDeleteSlugCreatedEvents(slug),
      {
        loading: 'Apagando evento...',
        success: () => `Evento: ${slug} apagado com sucesso!`,
        error: () => `Erro ao apagar o evento: ${slug}`,
      }
    );
    if (res.success) {
      setAllEvents(prevEvents => prevEvents.filter(e => e.Slug !== slug));
      setMyEvents(prevEvents => prevEvents.filter(e => e.Slug !== slug));
    }
  }, []);

  const handleRegister = useCallback(async (slug: string) => {
    const res = await runWithToast(
      handleRegisterFromEvent(slug),
      {
        loading: `Realizando a inscrição no evento: ${slug}...`,
        success: () => 'Inscrição realizada com sucesso!',
        error: () => 'Erro ao se inscrever no evento:',
      }
    )
    if(res.success) {
      const event = allEvents.find(e => e.Slug === slug);
      if (event && !myEvents.some(e => e.Slug === slug)) {
        setAllEvents(prev => prev.map(e => e.Slug === slug ? {...e, participant_count: e.participant_count + 1} : e));
        setMyEvents(prev => [...prev, {...event, participant_count: event.participant_count + 1}]);
      }
    }
  }, [allEvents, myEvents]);

  const handleUnregister = useCallback(async (slug: string) => {
    const res = await runWithToast(
      handleUnresgiterFromEvent(slug),
      {
        loading: `Removendo a inscrição do evento: ${slug}...`,
        success: () => 'Inscrição cancelada com sucesso!',
        error: () => 'Erro ao cancelar inscrição no evento:',
      }
    )
    if(res.success) {
      const event = allEvents.find(e => e.Slug === slug);
      setMyEvents(prev => prev.filter(e => e.Slug !== slug));
      if(event) setAllEvents(prev => prev.map(e => e.Slug === slug ? {...e, participant_count: e.participant_count - 1} : e));
    }
  }, [allEvents]);

  const handleUserEventRole = useCallback(async (slug: string, email: string, willPromote: boolean) => {
    await runWithToast(
      willPromote ? handlePromoteUserInEvent(slug, email) : handleDemoteUserInEvent(slug, email),
      {
        loading: `Alterando o papel do usuário no evento: ${slug}...`,
        success: () => willPromote ? 'Usuário promovido com sucesso!' : 'Usuário rebaixado com sucesso!',
        error: () => `Erro ao alterar o papel do usuário no evento: ${slug}`,
      }
    );
  }, []);

  return (
    <UserEventsContext.Provider value={{
      allEvents,
      myEvents,
      isLoading,
      refreshEvents: fetchEvents,
      handleEventCreate,
      handleEventUpdate,
      handleEventDelete,
      handleRegister,
      handleUnregister,
      handleUserEventRole
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
