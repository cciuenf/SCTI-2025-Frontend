"use client";

import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

type Props = {
  value?: Date | string | null;
  onChange?: (date: Date) => void;
  disabled?: boolean;
  placeholder?: string;
};

export function SimpleDateTimePicker({ value, onChange, disabled, placeholder }: Props) {
  const dateValue = value ? (typeof value === 'string' ? new Date(value) : value) : undefined;

  function handleDateSelect(date: Date | undefined) {
    if (date && onChange) {
      if (dateValue) {
        date.setHours(dateValue.getHours());
        date.setMinutes(dateValue.getMinutes());
      }
      onChange(date);
    }
  }

  function handleTimeChange(type: "hour" | "minute" | "ampm", timeValue: string) {
    if (!dateValue || !onChange) return;
    
    let newDate = new Date(dateValue);

    if (type === "hour") {
      const hour = parseInt(timeValue, 10);
      newDate.setHours(newDate.getHours() >= 12 ? hour + 12 : hour);
    } else if (type === "minute") {
      newDate.setMinutes(parseInt(timeValue, 10));
    } else if (type === "ampm") {
      const hours = newDate.getHours();
      if (timeValue === "AM" && hours >= 12) {
        newDate.setHours(hours - 12);
      } else if (timeValue === "PM" && hours < 12) {
        newDate.setHours(hours + 12);
      }
    }

    onChange(newDate);
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full pl-3 text-left font-normal",
            !dateValue && "text-primary"
          )}
          disabled={disabled}
        >
          {dateValue ? (
            format(dateValue, "MM/dd/yyyy hh:mm aa")
          ) : (
            <span>{placeholder || "MM/DD/YYYY hh:mm aa"}</span>
          )}
          <CalendarIcon className="ml-auto h-4 w-4 text-secondary/70" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 z-80" forceMount={true}>
        <div className="sm:flex">
          <Calendar
            mode="single"
            selected={dateValue}
            onSelect={handleDateSelect}
          />
          <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {Array.from({ length: 12 }, (_, i) => i + 1)
                  .reverse()
                  .map((hour) => (
                    <Button
                      key={hour}
                      size="icon"
                      variant={
                        dateValue &&
                        dateValue.getHours() % 12 === hour % 12
                          ? "hour"
                          : "ghost"
                      }
                      className="sm:w-full shrink-0 aspect-square"
                      onClick={() =>
                        handleTimeChange("hour", hour.toString())
                      }
                    >
                      {hour}
                    </Button>
                  ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {Array.from({ length: 12 }, (_, i) => i * 5).map(
                  (minute) => (
                    <Button
                      key={minute}
                      size="icon"
                      variant={
                        dateValue && dateValue.getMinutes() === minute
                          ? "hour"
                          : "ghost"
                      }
                      className="sm:w-full shrink-0 aspect-square"
                      onClick={() =>
                        handleTimeChange("minute", minute.toString())
                      }
                    >
                      {minute.toString().padStart(2, "0")}
                    </Button>
                  )
                )}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea className="">
              <div className="flex sm:flex-col p-2">
                {["AM", "PM"].map((ampm) => (
                  <Button
                    key={ampm}
                    size="icon"
                    variant={
                      dateValue &&
                      ((ampm === "AM" && dateValue.getHours() < 12) ||
                        (ampm === "PM" && dateValue.getHours() >= 12))
                        ? "hour"
                        : "ghost"
                    }
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() => handleTimeChange("ampm", ampm)}
                  >
                    {ampm}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
} 