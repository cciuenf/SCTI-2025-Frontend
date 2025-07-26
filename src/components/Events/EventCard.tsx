"use client";
import React from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Calendar, MapPin, ArrowUpRightFromSquare } from "lucide-react";
import { Badge } from "../ui/badge";

type Props = {
  slug: string;
  name: string;
  local: string;
  start_date: Date;
  end_date: Date;
  description: string;
};

const EventCard = ({
  slug,
  name,
  start_date,
  end_date,
  local,
  description,
}: Props) => {
  return (
    <div className="flex flex-col justify-around items-center bg-white rounded-lg shadow-md px-1 py-3 hover:shadow-lg transition-shadow">
      <div className="w-full flex flex-col justify-around items-start gap-3.5 mb-0 pl-2">
        <div className="w-full flex justify-between pr-2.5">
          <Badge className="bg-accent text-secondary">SCTI</Badge>
          <Link href={`/events/${slug}`} key={slug}>
            <ArrowUpRightFromSquare className="w-4 h-4" />
          </Link>
        </div>

        <h2 className="font-bold text-lg mb-0">{name}</h2>

        <div className="flex justify-between">
          <Calendar className="text-accent h-4 w-4 mr-2.5" />
          <h3 className="opacity-90 text-sm">{`De ${format(
            start_date,
            "dd/MM/yyyy"
          )} até ${format(end_date, "dd/MM/yyyy")}`}</h3>
        </div>
        <div className="flex justify-between">
          <MapPin className="text-accent h-4 w-4 mr-2.5" />
          <h3 className="opacity-90 text-sm">{local}</h3>
        </div>

        <h3 className="opacity-90 text-sm">{description}</h3>
        <Link href={`/events/${slug}`}>
          <div className="flex justify-around">
            <p className="font-bold mr-2 text-sm">Ver detalhes</p>
            <ArrowUpRightFromSquare className="w-4 h-4" />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
