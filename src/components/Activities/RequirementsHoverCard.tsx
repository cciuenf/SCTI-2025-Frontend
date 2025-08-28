"use client"
import React from "react";
import { HoverCard, HoverCardTrigger } from "../ui/hover-card";
import { InfoIcon } from "lucide-react";
import { HoverCardContent } from "@radix-ui/react-hover-card";
import { getActivityRequirements } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";

type Props = {
  data: string;
};

const RequirementsHoverCard = ({ data }: Props) => {
  const requirements = getActivityRequirements(data);
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Popover>
        <PopoverTrigger className="cursor-pointer">
          <InfoIcon className="w-5 h-5 text-secondary" />
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className="z-100 w-52 rounded-md bg-zinc-100 shadow-xs py-1"
        >
          <h4 className="mb-1">Requisitos</h4>
          <div className="w-full flex flex-col justify-around items-center gap-2">
            {requirements.map((req) => (
              <Badge
                className="bg-accent text-secondary truncate overflow-hidden whitespace-nowrap"
                key={Math.random() * 1000}
              >
                {req}
              </Badge>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    );
  }
  return (
    <HoverCard>
      <HoverCardTrigger className="cursor-pointer">
        <InfoIcon className="w-5 h-5 text-secondary" />
      </HoverCardTrigger>
      <HoverCardContent
        align="end"
        className="z-100 w-52 rounded-md bg-zinc-100 shadow-xs py-1"
      >
        <h4 className="mb-1">Requisitos</h4>
        <div className="w-full flex flex-col justify-around items-center gap-2">
          {requirements.map((req) => (
            <Badge
              className="bg-accent text-secondary truncate overflow-hidden whitespace-nowrap"
              key={Math.random() * 1000}
            >
              {req}
            </Badge>
          ))}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default RequirementsHoverCard;
