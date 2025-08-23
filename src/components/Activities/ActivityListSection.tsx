"use client";

import {
  handleDeleteActivity,
  handleGetAllEventActivities,
  handleGetUserEventActivities,
  handleRegisterFromActivity,
  handleUnregisterFromActivity,
} from "@/actions/activity-actions";
import type { ActivityResponseI, ActivityWithSlotResponseI } from "@/types/activity-interface";
import { useEffect, useState } from "react";
import ActivityModalForm from "./ActivityModalForm";
import { cn } from "@/lib/utils";
import { Coins, Plus } from "lucide-react";
import CardSkeleton from "../Loading/CardSkeleton";
import { toast } from "sonner";
import ActivityCard from "./ActivityCard";
import UserActivityInfoTable from "./UserActivityInfoTable";
import PresenceManagmentModalForm from "./PresenceManagementModalForm";
import { runWithToast } from "@/lib/client/run-with-toast";
import { handleGetAllUserTokens } from "@/actions/product-actions";
import type { UserTokensResponseI } from "@/types/product-interfaces";

interface ActivityListSectionProps {
  user_id: string;
  currentEvent: { id: string; slug: string };
  isEventCreator: boolean;
}

export default function ActivityListSection({
  currentEvent,
  user_id,
  isEventCreator,
}: ActivityListSectionProps) {
  const [isCreationModalOpen, setIsCreationModalOpen] = useState(false);
  const [userTokens, setUserTokens] = useState<UserTokensResponseI[]>([])
  const [isUsersModalOpen, setIsUsersModalOpen] = useState(false);
  const [isPresenceModalOpen, setIsPresenceModalOpen] = useState(false);
  const [searchUsersRegistrations, setSearchUsersRegistrations] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<ActivityResponseI>();
  const [myActivities, setMyActivities] = useState<ActivityWithSlotResponseI[]>([]);
  const [allActivities, setAllActivities] = useState<ActivityWithSlotResponseI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState<string>("all");

useEffect(() => {
  const fetchUserTokens = async () => {
    await runWithToast(handleGetAllUserTokens(), {
      loading: "Carregando seus Tokens",
      success: (res) => {
        setUserTokens(res.data || []);
        return "Tokens carregados com sucesso!";
      },
      error: () => "Falha ao carregar seus tokens",
    });
  };

  const fetchActivities = async () => {
    const id = toast.loading("Carregando Atividades...");
    setIsLoading(true);

    const [allActivitiesData, myActivitiesData] = await Promise.all([
      handleGetAllEventActivities(currentEvent.slug),
      handleGetUserEventActivities(currentEvent.slug),
    ]);

    const all: ActivityWithSlotResponseI[] = allActivitiesData.data || [];
    setAllActivities(all);

    const allById = new Map<string, ActivityWithSlotResponseI>(
      all.map((item) => [item.activity.ID, item])
    );

    const myRaw: ActivityResponseI[] = myActivitiesData.data || [];
    const my: ActivityWithSlotResponseI[] = myRaw
      .map((a) => allById.get(a.ID))
      .filter((v): v is ActivityWithSlotResponseI => Boolean(v));

    setMyActivities(my);

    if (allActivitiesData.success && myActivitiesData.success) {
      toast.success("Atividades carregadas com sucesso!", { id });
    } else if (!allActivitiesData.success && !myActivitiesData.success) {
      toast.error("Erro ao carregar as atividades", { id });
    } else {
      toast.error("Falha ao carregar alguma das atividades", { id });
    }

    setIsLoading(false);
  };

  fetchUserTokens();
  fetchActivities();
}, [currentEvent.slug, setAllActivities, setMyActivities]);

// Agora currentData sempre tem slots e ocupação
const currentData = currentView === "all" ? allActivities : myActivities;

  if (isLoading) {
    return (
      <div className="w-full max-w-6xl mt-6">
        <div className="flex w-full gap-2 mb-6">
          <div className="flex-1 bg-white rounded-lg shadow-md h-10 flex items-center justify-center animate-pulse" />
          <div className="flex-1 bg-white rounded-lg shadow-md h-10 flex items-center justify-center animate-pulse" />
        </div>
        <CardSkeleton count={6} />
      </div>
    );
  }

  const openCreationActivityModal = (activityToUpdate?: ActivityResponseI) => {
    setSelectedActivity(activityToUpdate);
    setIsCreationModalOpen(true);
  };

  const openPresenceActivityModal = (activityToManager?: ActivityResponseI) => {
    setSelectedActivity(activityToManager);
    setIsPresenceModalOpen(true);
  };

  const openUsersActivityModal = (
    is_registrations: boolean,
    activityToSee: ActivityResponseI
  ) => {
    setSelectedActivity(activityToSee);
    setIsUsersModalOpen(true);
    setSearchUsersRegistrations(is_registrations);
  };

  const wrapWithEmptySlots = (a: ActivityResponseI): ActivityWithSlotResponseI => ({
    activity: a,
    available_slots: { // Update on the next fetch
      id: "",
      total_capacity: a.has_unlimited_capacity ? 0 : a.max_capacity ?? 0,
      current_occupancy: 0,
      available_slots: a.has_unlimited_capacity ? Number.MAX_SAFE_INTEGER : (a.max_capacity ?? 0),
      has_unlimited_slots: a.has_unlimited_capacity,
      is_full: false,
    },
  });

  const adjustAvailability = (
    list: ActivityWithSlotResponseI[],
    activityId: string,
    delta: number
  ) => {
    return list.map((item) => {
      if (item.activity.ID !== activityId) return item;

      const slots = item.available_slots;

      // ilimitado: não muda nada
      if (slots.has_unlimited_slots) return item;

      const total = Math.max(0, slots.total_capacity ?? 0);
      const nextCurrent = Math.min(Math.max(0, (slots.current_occupancy ?? 0) + delta), total);
      const nextAvailable = Math.max(0, total - nextCurrent);
      const nextIsFull = total > 0 && nextCurrent >= total;

      return {
        ...item,
        available_slots: {
          ...slots,
          current_occupancy: nextCurrent,
          available_slots: nextAvailable,
          is_full: nextIsFull,
        },
      };
    });
  };


  const handleActivityCreate = (newActivity: ActivityResponseI) => {
    setAllActivities((prev) => [...prev, wrapWithEmptySlots(newActivity)]);
  };

  const handleActivityUpdate = (updatedActivity: ActivityResponseI) => {
    setAllActivities((prev) =>
      prev.map((item) =>
        item.activity.ID === updatedActivity.ID ? { ...item, activity: updatedActivity } : item
      )
    );
    setMyActivities((prev) =>
      prev.map((item) =>
        item.activity.ID === updatedActivity.ID ? { ...item, activity: updatedActivity } : item
      )
    );
  };

  const handleActivityDelete = async (activity_id: string) => {
    const res = await runWithToast(
      handleDeleteActivity({ activity_id: activity_id }, currentEvent.slug),
      {
        loading: 'Apagando atividade...',
        success: () => "Atividade: apagada com sucesso!",
        error: () => "Erro ao apagar a atividade",
      }
    );
    if (res.success) {
      setAllActivities((prev) => prev.filter((a) => a.activity.ID !== activity_id));
      setMyActivities((prev) => prev.filter((a) => a.activity.ID !== activity_id));
    }
  };

  const handleRegister = async (data: ActivityResponseI) => {
    const res = await runWithToast(
      handleRegisterFromActivity(data, currentEvent.slug, user_id),
      {
        loading: `Realizando a inscrição na atividade: ${data.name}...`,
        success: () => "Inscrição realizada com sucesso!",
        error: () => "Erro ao se inscrever na atividade",
      }
    );

    if (res.success) {
      const fromAll = allActivities.find((a) => a.activity.ID === data.ID);
      setMyActivities((prev) => {
        if (!fromAll || prev.some((a) => a.activity.ID === data.ID)) return prev;
        return [...prev, fromAll];
      });
      setAllActivities((prev) => adjustAvailability(prev, data.ID, +1));
      setMyActivities((prev) => adjustAvailability(prev, data.ID, +1));

      if(fromAll?.activity.has_fee) {
        setUserTokens((prev) => {
          const availableToken = prev.find((t) => !t.is_used);
          if(!availableToken) return prev;
          return prev.map((t) => t.id === availableToken.id ? {
            ...t, is_used: true, used_for_id: data.ID
          }: t)
        })
      }
    }
  };

  const handleUnregister = async (data: ActivityResponseI) => {
    const res = await runWithToast(
      handleUnregisterFromActivity(data, currentEvent.slug, user_id),
      {
        loading: `Removendo a inscrição da atividade: ${data.name}...`,
        success: () => "Inscrição cancelada com sucesso!",
        error: () => "Erro ao cancelar inscrição na atividade",
      }
    );
    if (res.success) {
      setAllActivities((prev) => adjustAvailability(prev, data.ID, -1));
      setMyActivities((prev) => adjustAvailability(prev, data.ID, -1));
      setMyActivities((prev) => prev.filter((a) => a.activity.ID !== data.ID));
      if(data.has_fee) {
        setUserTokens((prev) =>
          prev.map((t) => t.used_for_id === data.ID ? {
            ...t, is_used: false,  used_for_id: ""
          }: t)
        )
      }
    }
  };

  return (
    <>
      <div
        className={cn(
          "fixed top-2 right-2 w-32 h-8 px-4 py-2 rounded-full z-[160]",
          "flex justify-center items-center shadow-lg font-bold text-sm",
          "bg-gradient-to-r from-yellow-500 to-accent text-white",
          "truncate"
        )}
        title={userTokens.filter(t => !t.is_used).length + " Tokens"}
      >
        <Coins className="w-4 h-4 mr-2"/>
        {userTokens.filter((t) => !t.is_used).length} Tokens
      </div>
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
          <h2 className={cn(currentView !== "my" && "opacity-80")}>
            Minhas Atividades
          </h2>
        </div>
        {isEventCreator && (
          <Plus
            className={cn(
              "absolute h-full w-auto rounded-full p-2 scale-125 cursor-pointer",
              "text-white bg-accent shadow-md z-10 transition-all",
              "hover:text-accent hover:bg-secondary hover:scale-[140%]"
            )}
            onClick={() => openCreationActivityModal()}
          />
        )}
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
          <h2 className={cn(currentView !== "all" && "opacity-80")}>
            Todas as Atividades
          </h2>
        </div>
      </div>

      {currentData.length !== 0 ? (
        <div className="w-full max-w-6xl my-6">
          <div className="grid justify-center md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentData.map((wrapper) => {
              const act = wrapper.activity;
              return (
                <ActivityCard
                  key={act.ID}
                  data={wrapper}
                  isEventCreator={isEventCreator}
                  isSubscribed={myActivities.some((a) => a.activity.ID === act.ID)}
                  onRegister={handleRegister}
                  onUnregister={handleUnregister}
                  onUpdateFormOpen={() =>
                    isEventCreator ? openCreationActivityModal(act) : null
                  }
                  onDelete={handleActivityDelete}
                  onViewUsersOpen={openUsersActivityModal}
                  onPresenceManagerOpen={openPresenceActivityModal}
                />
              );
            })}
          </div>
        </div>
      ) : (
        <p className="mt-6 mb-10 text-center">
          Sem atividades disponíveis nessa seção
        </p>
      )}
      <ActivityModalForm
        currentEvent={currentEvent}
        activity={selectedActivity}
        isCreating={!selectedActivity}
        open={isCreationModalOpen}
        setOpen={setIsCreationModalOpen}
        onActivityCreate={handleActivityCreate}
        onActivityUpdate={handleActivityUpdate}
      />
      <UserActivityInfoTable
        activityId={selectedActivity?.ID || ""}
        slug={currentEvent.slug}
        activityName={selectedActivity?.name || "Não Selecionado"}
        open={isUsersModalOpen}
        setOpen={setIsUsersModalOpen}
        isRegistrations={searchUsersRegistrations}
      />

      <PresenceManagmentModalForm
        activityId={selectedActivity?.ID || ""}
        activityName={selectedActivity?.name || "Não Selecionado"}
        slug={currentEvent.slug}
        open={isPresenceModalOpen}
        setOpen={setIsPresenceModalOpen}
      />
    </>
  );
}
