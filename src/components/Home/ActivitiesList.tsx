"use client"
import type { ActivityWithSlotResponseI } from "@/types/activity-interface"
import ActivityCard from "../Activities/ActivityCard"
import { cn } from "@/lib/utils"
import { formatBR, safeTime, startOfLocalDay, toLocalDateKey } from "@/lib/date-utils"
import { useMemo, useState } from "react"
import { Input } from "../ui/input"
import { Calendar, ListFilter, Search } from "lucide-react"
import { Select } from "../ui/select"

interface Props {
  activities: ActivityWithSlotResponseI[]
}

export function ActivitiesList({
  activities
}: Props) {
  const [query, setQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const hasFilters = dateFilter !== "all" || query.trim().length > 0;
  const { minTs, maxTs } = useMemo(() => {
    if (!activities.length) return { minTs: 0, maxTs: 0 };

    let min = Infinity;
    let max = -Infinity;

    for (const w of activities) {
      const s = safeTime(w.activity.start_time);
      if (s < min) min = s;
      if (s > max) max = s;
    }
    return { minTs: startOfLocalDay(min), maxTs: startOfLocalDay(max) };
  }, [activities]);

  const dayOptions = useMemo(() => {
    if (!minTs || !maxTs || !isFinite(minTs) || !isFinite(maxTs)) return [];
    const days: { value: string; label: string }[] = [];

    for (let cur = minTs; cur <= maxTs; ) {
      days.push({ value: toLocalDateKey(cur), label: formatBR(cur) });
      const d = new Date(cur);
      d.setDate(d.getDate() + 1);
      cur = d.getTime();
    }
    return days;
  }, [minTs, maxTs]);


  const filteredSortedActivities = useMemo(() => {
    const q = query.trim().toLowerCase();
    const searched = q.length
      ? activities.filter((w) => {
          const { name = "", description = "" } = w.activity;
          return (
            String(name).toLowerCase().includes(q) ||
            String(description).toLowerCase().includes(q)
          );
        })
      : activities;

    const byDay = dateFilter === "all"
      ? searched
      : searched.filter((w) => toLocalDateKey(safeTime(w.activity.start_time)) === dateFilter);

    return [...byDay].sort(
      (a, b) => safeTime(a.activity.start_time) - safeTime(b.activity.start_time)
    );
  }, [activities, query, dateFilter]);

  const clearFilters = () => {
    setQuery("");
    setDateFilter("all");
  };

  return (
    <div 
      className="flex flex-col w-full h-full max-w-7xl"
    >
      <div
        className={cn(
          "flex flex-col sm:flex-row items-stretch flex-wrap sm:items-center gap-2 sm:gap-3",
          "w-full justify-center items-center py-3 px-4 shrink-0 mb-6"
        )}
      >
        <div className="relative flex-1 min-w-56">
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

        <div className="w-52">
          <Select
            value={dateFilter}
            onValueChange={(v) => setDateFilter(v)}
            className={cn(
              "h-10 w-full border border-zinc-300 bg-white px-3",
              "outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
            )}
            placeholder="Filtrar por data"
            searchPlaceholder="Buscar data..."
            title="Filtrar por data"
            options={[
              { value: "all", label: "Todas as datas", icon: ListFilter },
              ...dayOptions.map((d) => ({ value: d.value, label: d.label, icon: Calendar })),
            ]}
          />
        </div>
      </div>

      {filteredSortedActivities.length !== 0 ? (
        <div className={cn(
          "grid justify-center md:grid-cols-2 lg:grid-cols-3 sm:gap-10 gap-2 w-full px-32",
          ""
        )}>
          {filteredSortedActivities.map((card) => 
            <ActivityCard
              key={card.activity.ID}
              data={card}
              isAdminStatus={{ isAdmin: false, type: "" }}
              isEventCreator={false}
              isSubscribed={false}
            />
          )}
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
    </div>
  )
}