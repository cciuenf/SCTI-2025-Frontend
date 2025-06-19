"use client"

import { ActivityResponseI } from "@/types/activity-interface"
import { Button } from "../ui/button";
import ActivityModalForm from "./ActivityModalForm";
import { handleDeleteActivity } from "@/actions/activity-actions";

interface ProductProps {
  activity: ActivityResponseI;
  currentEvent: { id: string; slug: string }
  onActivityDelete: (activityId: string) => Promise<void>;
  onActivityUpdate: (updatedActivity: ActivityResponseI) => Promise<void>;
}

export default function ActivityHandle({ activity, currentEvent, onActivityDelete, onActivityUpdate }: ProductProps) {
  const submitDelete = async () => {
    const result = await handleDeleteActivity({activity_id: activity.ID}, currentEvent.slug);
    if (result?.success) await onActivityDelete(activity.ID);
  }
  
  return (
  <div className="mt-4 flex gap-2">
    <ActivityModalForm 
      currentEvent={currentEvent}
      isCreating={false} 
      activity={activity} 
      onActivityUpdate={onActivityUpdate}
    />
    <Button variant={"yellow"} onClick={async () => await submitDelete()}>
      Deletar
    </Button>
  </div>
  )
}