"use client"

import { handleDeleteActivity, handleGetAllEventActivities, handleGetUserEventActivities, handleRegisterFromActivity, handleUnregisterFromActivity } from "@/actions/activity-actions";
import { ActivityResponseI } from "@/types/activity-interface";
import { useEffect, useState } from "react";
import ActivityModalForm from "./ActivityModalForm";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import CardSkeleton from "../Loading/CardSkeleton";
import { toast } from "sonner";
import ActivityCard from "./ActivityCard";

interface ActivityListSectionProps { 
  user_id: string;
  currentEvent: { id: string; slug: string };
  isEventCreator: boolean;
}

export default function ActivityListSection({ currentEvent, user_id, isEventCreator }: ActivityListSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<ActivityResponseI>();
  const [myActivities, setMyActivities] = useState<ActivityResponseI[]>([]);
  const [allActivities, setAllActivities] = useState<ActivityResponseI[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<string>("all");

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const [allActivitiesData, myActivitiesData] = await Promise.all([
        handleGetAllEventActivities(currentEvent.slug),
        handleGetUserEventActivities(currentEvent.slug),
      ]);
      setAllActivities(allActivitiesData?.data || []);
      setMyActivities(myActivitiesData?.data || []);
    } catch (error) {
      console.error("Erro ao carregar atividades:", error);
      toast.error("Erro ao carregar atividades");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const currentData = currentView === "all" ? allActivities : myActivities;

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

  const openActivityModal = (activityToUpdate?: ActivityResponseI) => {
    setSelectedActivity(activityToUpdate);
    setIsModalOpen(true);
  }

  const handleActivityCreate = (newActivity: ActivityResponseI) => {
    setAllActivities(prev => [...prev, newActivity]);
  };

  const handleActivityUpdate = (updatedActivity: ActivityResponseI) => {
    setAllActivities(prev =>
      prev.map(a => a.ID === updatedActivity.ID ? updatedActivity : a)
    );
    setMyActivities(prev =>
      prev.map(a => a.ID === updatedActivity.ID ? updatedActivity : a)
    );
  };

  const handleActivityDelete = async (activity_id: string) => {
    const res = await handleDeleteActivity({ activity_id: activity_id }, currentEvent.slug);
    if (res.success) {
      setAllActivities(prev => prev.filter(a => a.ID !== activity_id));
      setMyActivities(prev => prev.filter(a => a.ID !== activity_id));
      toast.success("Atividade apagada com sucesso!");
    } else toast.error("Erro ao apagar a atividade");
  };

  const handleRegister = async (data: ActivityResponseI) => {
    const res = await handleRegisterFromActivity(data, currentEvent.slug, user_id);
    if (res.success) {
      const activity = allActivities.find(a => a.ID === data.ID);
      if (activity && !myActivities.some(a => a.ID === data.ID)) {
        setMyActivities(prev => [...prev, activity]);
        toast.success("Inscrição realizada com sucesso!");
      }
    } else toast.error("Erro ao se inscrever na atividade");
  };

  const handleUnregister = async (data: ActivityResponseI) => {
    const res = await handleUnregisterFromActivity(data, currentEvent.slug, user_id);
    if (res.success) {
      setMyActivities(prev => prev.filter(a => a.ID !== data.ID));
      toast.success("Inscrição cancelada com sucesso!");
    } else toast.error("Erro ao cancelar inscrição na atividade");
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
          <h2 className={cn(currentView !== "my" && "opacity-80")}>Minhas Atividades</h2>
        </div>
        {isEventCreator && 
          <Plus 
            className={cn(
              "absolute h-full w-auto rounded-full p-2 scale-125 cursor-pointer",
              "text-white bg-accent shadow-md z-10 transition-all",
              "hover:text-accent hover:bg-secondary hover:scale-[140%]",
            )}
            onClick={() => openActivityModal()}
          />
        }
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
          <h2 className={cn(currentView !== "all" && "opacity-80")}>Todas as Atividades</h2>
        </div>
      </div>

      {currentData?.length !== 0 ? (
        <div className="w-full max-w-5xl my-6">
          <div className="grid justify-center md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentData?.map((activity) => (
              <ActivityCard
                key={activity.ID}
                data={activity}
                isEventCreator={isEventCreator}
                isSubscribed={myActivities.some(a => a.ID === activity.ID)}
                onRegister={handleRegister}
                onUnregister={handleUnregister}
                onUpdateFormOpen={() => isEventCreator ? openActivityModal(activity) : null}
                onDelete={handleActivityDelete}
              />
            ))}
          </div>
        </div>
      ) : (
        <p className="mt-6 mb-10 text-center">Sem atividades disponíveis nessa seção</p>
      )}
      <ActivityModalForm 
        currentEvent={currentEvent}
        activity={selectedActivity}
        isCreating={!selectedActivity}
        open={isModalOpen}
        setOpen={setIsModalOpen}
        onActivityCreate={handleActivityCreate}
        onActivityUpdate={handleActivityUpdate}
      />
    </>
  )
}