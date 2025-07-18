"use client";
import { ActivityResponseI } from "@/types/activity-interface";
import { Button } from "../ui/button";

interface ActivitiesGeneralListSectionProps {
  slug: string;
  activities: ActivityResponseI[];
  onSubscribe?: (activity: ActivityResponseI) => void;
}

export default function ActivitiesGeneralListSection({ slug, activities, onSubscribe }: ActivitiesGeneralListSectionProps) {
  const handleSubscribe = (activity: ActivityResponseI) => {
    if (onSubscribe) onSubscribe(activity);
  };

  if (!activities.length) return <p>Sem atividades disponíveis para inscrição.</p>;

  return (
    <div className="w-full flex flex-wrap gap-4 justify-center">
      {activities.map(activity => (
        <div key={activity.ID} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow w-full max-w-md">
          <h3 className="text-xl font-bold mb-2">{activity.name}</h3>
          <p><span className="font-semibold">Speaker:</span> {activity.speaker}</p>
          <p><span className="font-semibold">Localização:</span> {activity.location}</p>
          <p><span className="font-semibold">Descrição:</span> {activity.description}</p>
          <Button variant="yellow" onClick={() => handleSubscribe(activity)}>
            Inscrever-se
          </Button>
        </div>
      ))}
    </div>
  );
} 