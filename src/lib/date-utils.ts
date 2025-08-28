import { isSameDay, isSameMonth, isSameYear } from "date-fns";
import { format, toZonedTime } from "date-fns-tz";
import { ptBR } from "date-fns/locale";

const DEFAULT_TIMEZONE = "America/Sao_Paulo";

export function normalizeDate(
  value: string | Date | null | undefined,
  timeZone: string = DEFAULT_TIMEZONE
): Date | null {
  if (!value) return null;

  const parsed = value instanceof Date ? value : new Date(value);
  if (isNaN(parsed.getTime())) return null;

  return toZonedTime(parsed, timeZone);
}

export function formatEventDateRange(start_date: Date | null, end_date: Date | null) {
  if(!start_date || !end_date) return "";
  const sameDay = isSameDay(start_date, end_date);
  const sameMonth = isSameMonth(start_date, end_date);
  const sameYear = isSameYear(start_date, end_date);

  if (sameDay)
    return format(start_date, "dd 'de' MMMM, HH:mm", { locale: ptBR });
  if (sameMonth && sameYear)
    return `${format(start_date, "dd", { locale: ptBR })}-${format(
      end_date,
      "dd 'de' MMMM, yyyy",
      { locale: ptBR }
    )}`;
  return `${format(start_date, "dd/MM/yyyy")} até ${format(
    end_date,
    "dd/MM/yyyy"
  )}`;
}

export function formatFullDate(dateString: string) {
  const formatted = format(dateString, "d MMM',' yyyy 'às' HH:mm", {
    locale: ptBR,
  });
  return formatted;
}

export function formatEventTimeRange(start_date: Date, end_date: Date) {
  if (isSameDay(start_date, end_date))
    return `${format(start_date, "HH:mm")} - ${format(end_date, "HH:mm")}`;
  return "Horários em dias diferentes";
}

export function safeTime (time: string) {
  return (normalizeDate(time) || new Date(8640000000000000)).getTime();
}