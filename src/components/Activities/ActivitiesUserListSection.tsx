"use client";
import { ActivityResponseI } from "@/types/activity-interface";
import { Button } from "../ui/button";

interface ActivitiesUserListSectionProps {
  slug: string;
  activities: ActivityResponseI[];
  onUnsubscribe?: (activity: ActivityResponseI) => void;
}

export default function ActivitiesUserListSection({ slug, activities, onUnsubscribe }: ActivitiesUserListSectionProps) {
  const handleUnsubscribe = (activity: ActivityResponseI) => {
    if (onUnsubscribe) onUnsubscribe(activity);
  };

  if (!activities.length) return <p>Você não está inscrito em nenhuma atividade.</p>;

  return (
    <div className="w-full flex flex-wrap gap-4 justify-center">
      {activities.map(activity => (
        <div key={activity.ID} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow w-full max-w-md">
          <h3 className="text-xl font-bold mb-2">{activity.name}</h3>
          <p><span className="font-semibold">Speaker:</span> {activity.speaker}</p>
          <p><span className="font-semibold">Localização:</span> {activity.location}</p>
          <p><span className="font-semibold">Descrição:</span> {activity.description}</p>
          <Button variant="yellow" onClick={() => handleUnsubscribe(activity)}>
            Desinscrever-se
          </Button>
        </div>
      ))}
    </div>
  );
} 