"use client";
import type { ActivityResponseI } from "@/types/activity-interface";
import { useEffect, useState } from "react";
import {
  handleGetActivitiesWhichUserParticipate,
  handleGetUserEventActivities,
} from "@/actions/activity-actions";
import { Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ActivitiesDashboardListSkeleton from "./ActivitiesDashboardListSkeleton";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import ActivityDashboardListItem from "./ActivityDashboardListItem";

const ActivitiesDashboardCard = () => {
  const [activitiesByDay, setActivitiesByDay] = useState<
    Map<string, ActivityResponseI[]>
  >(new Map([]));
  const [currentDay, setCurrentDay] = useState<number>(0);
  const [attendedEventsIds, setAttendedEventsIds] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const days = [
    "segunda-feira",
    "terça-feira",
    "quarta-feira",
    "quinta-feira",
    "sexta-feira",
  ];

  useEffect(() => {
    const getUserActivitesByDay = async () => {
      setIsLoading(true);
      const res = await handleGetUserEventActivities("scti");
      if (!res.success) {
        router.push("/");
        toast.error("Erro ao adquirir informações do usuário!");
      }
      if (res.success && res.data) {
        const groupedActivities = res.data.reduce((acc, activity) => {
          const date = new Date(activity.start_time).toLocaleDateString(
            "pt-BR",
            { weekday: "long" }
          );
          if (!acc.has(date)) {
            acc.set(date, []);
          }
          acc.get(date)?.push(activity);
          return acc;
        }, new Map<string, ActivityResponseI[]>());
        setActivitiesByDay(groupedActivities);
      }
      const activitiesWhichUserParticipate =
        await handleGetActivitiesWhichUserParticipate();
      if (
        activitiesWhichUserParticipate.success &&
        activitiesWhichUserParticipate.data &&
        activitiesWhichUserParticipate.data.length > 0
      ) {
        const ids = activitiesWhichUserParticipate.data.map((el) => el.ID);

        setAttendedEventsIds(ids);
      }
      setIsLoading(false);
    };

    getUserActivitesByDay();
  }, [currentDay, router]);

  return (
    <div className="flex flex-col gap-5 min-h-80 items-start shadow-sm rounded-md py-5">
      <div className="w-full flex flex-col gap-2 sm:gap-0 sm:flex-row justify-around sm:justify-between items-center sm:items-start px-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-6 w-6 text-secondary" />
          <h2 className="text-2xl sm:text-2xl font-bold">Minhas Atividades</h2>
        </div>
        <div className="flex gap-2">
          <Button
            size={"day"}
            variant={"day"}
            className={cn(currentDay == 0 && "bg-secondary text-zinc-100")}
            onClick={() => setCurrentDay(0)}
          >
            Seg
          </Button>
          <Button
            size={"day"}
            variant={"day"}
            className={cn(currentDay == 1 && "bg-secondary text-zinc-100")}
            onClick={() => setCurrentDay(1)}
          >
            Ter
          </Button>
          <Button
            size={"day"}
            variant={"day"}
            className={cn(currentDay == 2 && "bg-secondary text-zinc-100")}
            onClick={() => setCurrentDay(2)}
          >
            Qua
          </Button>
          <Button
            size={"day"}
            variant={"day"}
            className={cn(currentDay == 3 && "bg-secondary text-zinc-100")}
            onClick={() => setCurrentDay(3)}
          >
            Qui
          </Button>
          <Button
            size={"day"}
            variant={"day"}
            className={cn(currentDay == 4 && "bg-secondary text-zinc-100")}
            onClick={() => setCurrentDay(4)}
          >
            Sex
          </Button>
        </div>
      </div>

      <div className="w-full h-full flex flex-col px-4 justify-between gap-10 text-center">
        {isLoading ? (
          <div className="flex w-full justify-center items-center">
            <ActivitiesDashboardListSkeleton />
          </div>
        ) : (
          <div className="w-full">
            {activitiesByDay.get(days[currentDay]) &&
            activitiesByDay.get(days[currentDay]) != undefined ? (
              activitiesByDay
                .get(days[currentDay])
                ?.map((activity) => (
                  <ActivityDashboardListItem
                    activity={activity}
                    userAttends={attendedEventsIds}
                    key={activity.ID}
                  />
                ))
            ) : (
              <p className="sm:text-xl">
                Parece que você ainda não tem atividades para esse dia!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivitiesDashboardCard;
