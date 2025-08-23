"use client";

import {
  handleDeleteActivity,
  handleGetAllEventActivities,
  handleGetUserEventActivities,
  handleRegisterFromActivity,
  handleUnregisterFromActivity,
} from "@/actions/activity-actions";
import type { ActivityResponseI } from "@/types/activity-interface";
import { useEffect, useState } from "react";
import ActivityModalForm from "./ActivityModalForm";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import CardSkeleton from "../Loading/CardSkeleton";
import { toast } from "sonner";
import ActivityCard from "./ActivityCard";
import UserActivityInfoTable from "./UserActivityInfoTable";
import PresenceManagmentModalForm from "./PresenceManagementModalForm";
import { runWithToast } from "@/lib/client/run-with-toast";

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
  const [isUsersModalOpen, setIsUsersModalOpen] = useState(false);
  const [isPresenceModalOpen, setIsPresenceModalOpen] = useState(false);
  const [searchUsersRegistrations, setSearchUsersRegistrations] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<ActivityResponseI>();
  const [myActivities, setMyActivities] = useState<ActivityResponseI[]>([]);
  const [allActivities, setAllActivities] = useState<ActivityResponseI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState<string>("all");

  useEffect(() => {
    const fetchActivities = async () => {
      const id = toast.loading('Carregando Atividades...');
      setIsLoading(true);
      const [allActivitiesData, myActivitiesData] = await Promise.all([
        handleGetAllEventActivities(currentEvent.slug),
        handleGetUserEventActivities(currentEvent.slug),
      ]);
      setAllActivities(allActivitiesData.data || []);
      setMyActivities(myActivitiesData.data || []);
      if (allActivitiesData.success && myActivitiesData.success)
        toast.success('Atividades carregadas com sucesso!', { id });
      else if(!allActivitiesData.success && !myActivitiesData.success) 
        toast.error("Erro ao carregar as atividades", { id });
      else toast.error('Falha ao carregar alguma das atividades', { id });
      setIsLoading(false);
    };
    fetchActivities();
  }, [currentEvent.slug]);

  const currentData = currentView === "all" ? allActivities : myActivities;

  if (isLoading) {
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

  const handleActivityCreate = (newActivity: ActivityResponseI) => {
    setAllActivities((prev) => [...prev, newActivity]);
  };

  const handleActivityUpdate = (updatedActivity: ActivityResponseI) => {
    setAllActivities((prev) =>
      prev.map((a) => (a.ID === updatedActivity.ID ? updatedActivity : a))
    );
    setMyActivities((prev) =>
      prev.map((a) => (a.ID === updatedActivity.ID ? updatedActivity : a))
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
      setAllActivities((prev) => prev.filter((a) => a.ID !== activity_id));
      setMyActivities((prev) => prev.filter((a) => a.ID !== activity_id));
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
      const activity = allActivities.find((a) => a.ID === data.ID);
      if (activity && !myActivities.some((a) => a.ID === data.ID))
        setMyActivities((prev) => [...prev, activity]);
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
    if (res.success) setMyActivities((prev) => prev.filter((a) => a.ID !== data.ID));
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
        <div className="w-full max-w-5xl my-6">
          <div className="grid justify-center md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentData.map((activity) => (
              <ActivityCard
                key={activity.ID}
                data={activity}
                isEventCreator={isEventCreator}
                isSubscribed={myActivities.some((a) => a.ID === activity.ID)}
                onRegister={handleRegister}
                onUnregister={handleUnregister}
                onUpdateFormOpen={() =>
                  isEventCreator ? openCreationActivityModal(activity) : null
                }
                onDelete={handleActivityDelete}
                onViewUsersOpen={openUsersActivityModal}
                onPresenceManagerOpen={openPresenceActivityModal}
              />
            ))}
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
