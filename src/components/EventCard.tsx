"use client";
import React from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Separator } from "./ui/separator";

type Props = {
  slug: string;
  name: string;
  local: string;
  start_date: Date;
  end_date: Date;
  actionButton?: React.ReactNode;
};

const EventCard = ({
  slug,
  name,
  start_date,
  end_date,
  actionButton,
  local,
}: Props) => {
  return (
    <div className="flex flex-col justify-around items-center gap-5 bg-white rounded-lg shadow-md px-1 py-3 hover:shadow-lg transition-shadow">
      <div className="w-3/4 flex justify-between items-center ">
        <Link
          href={`/events/${slug}`}
          key={slug}
          className="hover:opacity-70 duration-300 w-3/5 lg:pr-5 sm:pr-0 sm:w-1/2"
          aria-label={`Ver detalhes do evento ${name}`}
        >
          <h2 className="font-bold text-lg">{name}</h2>
        </Link>

        <Separator className="bg-accent" orientation="vertical" />

        <div className="flex flex-col items-center justify-around w-2/5 gap-2 pl-2 text-center sm:pl-0 sm:w-1/2">
          <h3 className="opacity-90 text-sm">{`de ${format(
            start_date,
            "dd/MM/yyyy"
          )}`}</h3>
          <h3 className="opacity-90 text-sm">{`até ${format(
            end_date,
            "dd/MM/yyyy"
          )}`}</h3>
          <h3 className="opacity-90 text-sm">{local}</h3>
        </div>
      </div>

      {actionButton}
    </div>
  );
};

export default EventCard;
