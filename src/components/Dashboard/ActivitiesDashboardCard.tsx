"use client";
import type { ActivityResponseI } from "@/types/activity-interface";
import { useEffect, useState } from "react";
import { handleGetUserEventActivities } from "@/actions/activity-actions";
import { ArrowLeftCircle, ArrowRightCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ActivitiesDashboardListSkeleton from "./ActivitiesDashboardListSkeleton";

const ActivitiesDashboardCard = () => {
  const [activitiesByDay, setActivitiesByDay] = useState<
    Map<string, ActivityResponseI[]>
  >(new Map([]));
  const [currentDay, setCurrentDay] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const days = [
    "Segunda-Feira",
    "Terça-Feira",
    "Quarta-Feira",
    "Quinta-Feira",
    "Sexta-Feira",
  ];

  const setDay = (type: "add" | "sub") => {
    if (type == "add" && currentDay + 1 <= 4) {
      setCurrentDay(currentDay + 1);
      return;
    }

    if (type == "sub" && currentDay - 1 >= 0) {
      setCurrentDay(currentDay - 1);
      return;
    }
  };

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
      setIsLoading(false);
    };

    getUserActivitesByDay();
  }, [currentDay, router]);

  return (
    <div className="w-9/10 lg:w-3/5 min-h-[310px] flex flex-col gap-5 items-center shadow-sm rounded-md py-5 shrink">
      <h2 className="text-2xl sm:text-3xl font-bold">Minhas Atividades</h2>
      <div className="w-full sm:w-4/5 flex justify-between items-start px-7 md:px-20">
        <ArrowLeftCircle
          className="cursor-pointer w-6 h-6 sm:w-7 sm:h-7 text-accent hover:opacity-70 duration-300"
          onClick={() => setDay("sub")}
        />
        <h2 className="text-xl sm:text-2xl mb-3 ">{days[currentDay]}</h2>
        <ArrowRightCircle
          className="cursor-pointer w-6 h-6 sm:w-7 sm:h-7 text-accent hover:opacity-70 duration-300"
          onClick={() => setDay("add")}
        />
      </div>

      <div className="w-full h-full flex flex-col px-4 justify-between gap-10 text-center">
        {isLoading ? (
          <div className="flex w-full justify-center items-center">
            <ActivitiesDashboardListSkeleton />
          </div>
        ) : (
          <div className="w-full lg:w-3/5 lg:mx-auto">
            {activitiesByDay.get(days[currentDay].toLocaleLowerCase()) &&
            activitiesByDay.get(days[currentDay].toLocaleLowerCase()) !=
              undefined ? (
              activitiesByDay
                .get(days[currentDay].toLocaleLowerCase())
                ?.map((activity) => (
                  <div
                    key={activity.ID}
                    className="flex justify-between items-center basis-1/3 text-base sm:text-xl border-l-1 border-secondary pl-2 mb-3"
                  >
                    <p>{activity.name}</p>
                    <div className="flex flex-col justify-between">
                      <p className="text-xs text-secondary">
                        {new Date(activity.start_time).toLocaleTimeString(
                          "pt-BR",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                      <p className="text-xs text-foreground">
                        {new Date(activity.end_time).toLocaleTimeString(
                          "pt-BR",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                  </div>
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
