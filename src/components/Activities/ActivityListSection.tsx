"use client"

import { handleGetAllEventActivities } from "@/actions/activity-actions";
import { ActivityResponseI } from "@/types/activity-interface";
import { useEffect, useState } from "react";
import ActivityModalForm from "./ActivityModalForm";
import ActivitiesList from "./ActivitiesList";

interface ActivityListSectionProps { 
  currentEvent: { id: string; slug: string }
}

export default function ActivityListSection({ currentEvent }: ActivityListSectionProps) {
  const [activities, setActivities] = useState<ActivityResponseI[]>([])

  const refreshAllActivities = async () => {
    const response = await handleGetAllEventActivities(currentEvent.slug);
    if (response.success) setActivities(response.data);
  };

  const handleActivityCreate = async (newActivity: ActivityResponseI) => {
    setActivities(prevActivities => [...prevActivities, newActivity]);
  };

  const handleActivityUpdate = async (updatedActivity: ActivityResponseI) => {
    setActivities(prevActivities =>
      prevActivities.map(a => a.ID === updatedActivity.ID ? updatedActivity : a)
    );
  };

  const handleActivityDelete = async (activityId: string) => {
    setActivities(prevActivities => prevActivities.filter(a => a.ID !== activityId));
  };

  useEffect(() => { 
    refreshAllActivities();
  }, []);

  return (
    <div className="flex flex-col items-center font-spartan p-4">
      <ActivityModalForm 
        currentEvent={currentEvent} 
        isCreating={true} 
        onActivityCreate={handleActivityCreate}
      />
      <h1 className="font-black text-2xl mb-6 mt-2">Atividades:</h1>
      <ActivitiesList 
        activities={activities}
        currentEvent={currentEvent}
        onActivityUpdate={handleActivityUpdate}
        onActivityDelete={handleActivityDelete}
      />
    </div>
  )
}