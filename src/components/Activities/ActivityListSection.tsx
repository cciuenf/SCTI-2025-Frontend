"use client";

import {
  handleDeleteActivity,
  handleGetAllEventActivities,
  handleGetUserEventActivities,
  handleRegisterFromActivity,
  handleUnregisterFromActivity,
} from "@/actions/activity-actions";
import type {
  ActivityResponseI,
  ActivityWithSlotResponseI,
} from "@/types/activity-interface";
import { type Dispatch, type SetStateAction, useEffect, useMemo, useState } from "react";
import ActivityModalForm from "./ActivityModalForm";
import { cn } from "@/lib/utils";
import {
  CheckCircle,
  Coins,
  DollarSign,
  ListFilter,
  Search,
  Ticket,
  UserCheck,
  Calendar,
} from "lucide-react";
import CardSkeleton from "../Loading/CardSkeleton";
import ActivityCard from "./ActivityCard";
import UserActivityInfoTable from "./UserActivityInfoTable";
import PresenceManagmentModalForm from "./PresenceManagementModalForm";
import { runWithToast } from "@/lib/client/run-with-toast";
import { handleGetAllUserTokens } from "@/actions/product-actions";
import type { UserTokensResponseI } from "@/types/product-interfaces";
import { safeTime } from "@/lib/date-utils";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import Link from "next/link";

interface ActivityListSectionProps {
  user_id: string;
  currentEvent: { id: string; slug: string };
  isEventCreator: boolean;
  isCreationModalOpen: boolean,
  setIsCreationModalOpen: Dispatch<SetStateAction<boolean>>;
}

type FilterKey = "all" | "my" | "free" | "paid" | "available";

export default function ActivityListSection({
  currentEvent,
  user_id,
  isEventCreator,
  isCreationModalOpen,
  setIsCreationModalOpen
}: ActivityListSectionProps) {
  const [userTokens, setUserTokens] = useState<UserTokensResponseI[]>([]);
  const [isUsersModalOpen, setIsUsersModalOpen] = useState(false);
  const [isPresenceModalOpen, setIsPresenceModalOpen] = useState(false);
  const [searchUsersRegistrations, setSearchUsersRegistrations] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<ActivityResponseI>();
  const [myActivities, setMyActivities] = useState<ActivityWithSlotResponseI[]>([]);
  const [allActivities, setAllActivities] = useState<ActivityWithSlotResponseI[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");

  useEffect(() => {
    const fetchUserTokens = async () => {
      const res = await handleGetAllUserTokens();
      if (res.data) setUserTokens(res.data);
    };

    const fetchActivities = async () => {
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
      setIsLoading(false);
    };

    fetchUserTokens();
    fetchActivities();
  }, [currentEvent.slug]);

  const wrapWithEmptySlots = (a: ActivityResponseI): ActivityWithSlotResponseI => ({
    activity: a,
    available_slots: {
      id: "",
      total_capacity: a.has_unlimited_capacity ? 0 : a.max_capacity ?? 0,
      current_occupancy: 0,
      available_slots: a.has_unlimited_capacity
        ? Number.MAX_SAFE_INTEGER
        : a.max_capacity ?? 0,
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
      if (slots.has_unlimited_slots) return item;

      const total = Math.max(0, slots.total_capacity ?? 0);
      const nextCurrent = Math.min(
        Math.max(0, (slots.current_occupancy ?? 0) + delta),
        total
      );
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
        item.activity.ID === updatedActivity.ID
          ? { ...item, activity: updatedActivity }
          : item
      )
    );
    setMyActivities((prev) =>
      prev.map((item) =>
        item.activity.ID === updatedActivity.ID
          ? { ...item, activity: updatedActivity }
          : item
      )
    );
  };

  const handleActivityDelete = async (activity_id: string) => {
    const res = await runWithToast(
      handleDeleteActivity({ activity_id }, currentEvent.slug),
      {
        loading: "Apagando atividade...",
        success: () => "Atividade: apagada com sucesso!",
        error: () => "Erro ao apagar a atividade",
      }
    );
    if (res.success) {
      setAllActivities((prev) =>
        prev.filter((a) => a.activity.ID !== activity_id)
      );
      setMyActivities((prev) =>
        prev.filter((a) => a.activity.ID !== activity_id)
      );
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

      if (fromAll?.activity.has_fee) {
        setUserTokens((prev) => {
          const availableToken = prev.find((t) => !t.is_used);
          if (!availableToken) return prev;
          return prev.map((t) =>
            t.id === availableToken.id
              ? { ...t, is_used: true, used_for_id: data.ID }
              : t
          );
        });
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
      setMyActivities((prev) =>
        prev.filter((a) => a.activity.ID !== data.ID)
      );

      if (data.has_fee) {
        setUserTokens((prev) =>
          prev.map((t) =>
            t.used_for_id === data.ID
              ? { ...t, is_used: false, used_for_id: "" }
              : t
          )
        );
      }
    }
  };

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

  const baseList: ActivityWithSlotResponseI[] = useMemo(() => {
    switch (filter) {
      case "my":
        return myActivities;
      case "free":
        return allActivities.filter((w) => !w.activity.has_fee);
      case "paid":
        return allActivities.filter((w) => w.activity.has_fee);
      case "available":
        return allActivities.filter(
          (w) =>
            w.available_slots.has_unlimited_slots || !w.available_slots.is_full
        );
      case "all":
      default:
        return allActivities;
    }
  }, [filter, allActivities, myActivities]);

  const filteredSortedActivities = useMemo(() => {
    const q = query.trim().toLowerCase();
    const searched = q.length
      ? baseList.filter((w) => {
          const { name = "", description = "" } = w.activity;
          return (
            String(name).toLowerCase().includes(q) ||
            String(description).toLowerCase().includes(q)
          );
        })
      : baseList;

    return [...searched].sort(
      (a, b) => safeTime(a.activity.start_time) - safeTime(b.activity.start_time)
    );
  }, [baseList, query]);

  const availableTokensCount = userTokens.filter((t) => !t.is_used).length;
  const hasFilters = filter !== "all" || query.trim().length > 0;

  const clearFilters = () => {
    setQuery("");
    setFilter("all");
  };

  if (isLoading) {
    return (
      <div className="w-full mt-6">
        <div className="flex w-full gap-2 mb-6">
          <div className="flex-1 bg-white rounded-lg shadow-md h-10 flex items-center justify-center animate-pulse" />
          <div className="flex-1 bg-white rounded-lg shadow-md h-10 flex items-center justify-center animate-pulse" />
        </div>
        <CardSkeleton count={6} />
      </div>
    );
  }

  return (
    <section className="h-full flex flex-col">
      <div
        className={cn(
          "shrink-0",
          "flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3",
          "w-full mt-2 justify-center items-center py-3"
        )}
      >
        <div className="relative flex-1">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar atividades..."
            className={cn(
              "w-full h-10 rounded-md border border-zinc-300 bg-white pr-9 pl-10",
              "outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
            )}
          />
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
        </div>

        <div className="w-46">
          <Select
            value={filter}
            onValueChange={(v) => setFilter(v as FilterKey)}
            className={cn(
              "h-10 w-full border border-zinc-300 bg-white px-3",
              "outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
            )}
            placeholder="Filtrar atividades"
            searchPlaceholder="Buscar..."
            title="Filtrar atividades"
            options={[
              { value: "all",       label: "Todas",     icon: ListFilter },
              { value: "my",        label: "Minhas",    icon: UserCheck },
              { value: "available", label: "Com vagas", icon: CheckCircle },
              { value: "free",      label: "Gratuitas", icon: Ticket },
              { value: "paid",      label: "Pagas",     icon: DollarSign },
            ]}
          />
        </div>

        <div
          className={cn(
            "h-10 w-32 px-3 rounded-md flex items-center gap-2",
            "bg-gradient-to-r from-yellow-500 to-accent text-white",
            "shadow-md font-semibold"
          )}
          title={`${availableTokensCount} Tokens disponíveis`}
        >
          <Coins className="w-4 h-4" />
          <span>{availableTokensCount} Tokens</span>
        </div>

        <Link
          href="/dashboard"
          className={cn(
            "h-10 px-3 rounded-md flex items-center gap-2",
            "bg-white border border-zinc-300 text-zinc-800",
            "hover:bg-zinc-50 transition-colors"
          )}
          title="Ir para Meu Cronograma"
        >
          <Calendar className="w-4 h-4" />
          <span className="whitespace-nowrap">Meu Cronograma</span>
        </Link>
      </div>

      {filteredSortedActivities.length !== 0 ? (
        <div
          className={cn(
            "relative w-full flex-1",
            "overflow-y-auto scrollbar-unvisible"
          )}
        >
          <div className="grid justify-center md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 p-6">
            {filteredSortedActivities.map((wrapper) => {
              const act = wrapper.activity;
              const isSubscribed = myActivities.some(
                (a) => a.activity.ID === act.ID
              );

              return (
                <ActivityCard
                  key={act.ID}
                  data={wrapper}
                  isEventCreator={isEventCreator}
                  isSubscribed={isSubscribed}
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
        <div className="w-full my-10 px-3 sm:px-5 lg:px-10">
          <div
            className={cn(
              "mx-auto max-w-xl text-center rounded-xl border border-dashed border-zinc-300",
              "bg-white/70 p-8 sm:p-10 shadow-sm"
            )}
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100">
              <Search className="h-7 w-7 text-zinc-500" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-800">
              Nenhuma atividade encontrada
            </h3>
            <p className="mt-1 text-sm text-zinc-600">
              Não encontramos resultados para a sua pesquisa atual. Tente
              ajustar os termos ou alterar os filtros.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={clearFilters}
                className={cn(
                  "h-9 px-3 rounded-md flex items-center gap-2",
                  "bg-zinc-100 text-zinc-800 hover:bg-zinc-200 transition-colors"
                )}
                title="Limpar busca e filtros"
              >
                <ListFilter className="w-4 h-4" />
                <span>Limpar filtros</span>
              </button>
              <button
                onClick={() => setFilter("available")}
                className={cn(
                  "h-9 px-3 rounded-md flex items-center gap-2",
                  "bg-accent text-white hover:opacity-90 transition-opacity"
                )}
                title="Ver somente atividades com vagas"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Ver com vagas</span>
              </button>
              {hasFilters ? null : (
                <button
                  onClick={() => setQuery("")}
                  className={cn(
                    "h-9 px-3 rounded-md flex items-center gap-2",
                    "bg-white border border-zinc-300 text-zinc-800 hover:bg-zinc-50 transition-colors"
                  )}
                  title="Limpar busca"
                >
                  <Search className="w-4 h-4" />
                  <span>Limpar busca</span>
                </button>
              )}
            </div>
          </div>
        </div>
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
    </section>
  );
}
