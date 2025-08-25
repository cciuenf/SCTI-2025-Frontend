"use client";
import React from "react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { handleGetUserEventActivities } from "@/actions/activity-actions";
import type { ActivityResponseI } from "@/types/activity-interface";
import { Clock } from "lucide-react";
import { Badge } from "../ui/badge";
import LevelBadge from "../Activities/LevelBadge";
import { useIsMobile } from "@/hooks/use-mobile";
import ActivitiesDashboardListSkeleton from "./ActivitiesDashboardListSkeleton";
import { formatEventDateRange } from "@/lib/date-utils";

const NearActivitiesListCard = () => {
  const [nearActivities, setNearActivities] = useState<ActivityResponseI[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const res = await handleGetUserEventActivities("scti");
      const today = new Date();

      if (res.data && res.success) {
        const nearestActivities = res.data
          .filter((activity) => new Date(activity.start_time) > today)
          .sort(
            (a, b) =>
              new Date(a.start_time).getTime() -
              new Date(b.start_time).getTime()
          )
          .slice(0, 3);

        setNearActivities(nearestActivities);
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-evenly rounded-md py-1">
        <h2 className="text-2xl font-bold">Atividades Mais Próximas</h2>
        <div className="flex w-full justify-center items-center">
          <ActivitiesDashboardListSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-around rounded-md shadow-sm py-1 px-2">
      <h2 className="text-2xl font-bold">Atividades Mais Próximas</h2>
      <div className="w-full">
        {nearActivities &&
          nearActivities.map((activity) => (
            <div
              key={activity.ID}
              className={cn(
                "w-full flex basis-1/3 min-h-16 py-0.5 justify-between items-center border-l-3 px-2 mb-3 rounded-r-lg",
                "bg-blue-100 text-secondary border-secondary"
              )}
            >
              <div className="w-full flex flex-col justify-between items-start">
                <p className="text-left text-sm sm:text-base max-w-88">
                  {activity.name}
                </p>
                <div className="flex gap-3 items-center">
                  <div className="flex gap-1 items-center">
                    <Clock className="h-3 w-3" />
                    <p className="text-xs text-left">
                      {`${formatEventDateRange(
                        new Date(activity.start_time),
                        new Date(activity.end_time)
                      )}
                    `}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-1">
                {activity.type && (
                  <Badge className="bg-blue-200 text-blue-800 rounded-2xl">
                    {activity.type.charAt(0).toUpperCase() +
                      activity.type.substring(1)}
                  </Badge>
                )}
                {isMobile ? (
                  <LevelBadge level={activity.level} icon={true} />
                ) : (
                  <LevelBadge level={activity.level} />
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default NearActivitiesListCard;
