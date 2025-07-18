"use client";
import { ReactNode, useEffect, useState } from "react";
import { toast } from "sonner";

import EventCard from "./EventCard";
import {
  handleRegisterFromEvent,
  handleUnresgiterFromEvent,
} from "@/actions/event-actions";
import { EventResponseI } from "@/types/event-interfaces";
import { Button } from "./ui/button";

type Props = {
  fetchFunction: () => Promise<
    | { success: boolean; data: EventResponseI[] }
    | { success: boolean; data?: EventResponseI[] }
  >;
  eventFilter?: "criados" | "inscrito";
};

const EventListSection = ({ fetchFunction, eventFilter }: Props) => {
  const [currentData, setCurrentData] = useState<EventResponseI[] | undefined>(
    []
  );
  const [switchedRegister, setSwitchedRegister] = useState<boolean>(false)

  const handleFetch = async () => {
    const data = await fetchFunction();
    if (data?.success) {
      setCurrentData(data.data);
    }
  };

    useEffect(() => {
      handleFetch();
    }, [switchedRegister]);

  const handleOnClick = (action: "inscreveu-se" | "desinscreveu-se", slug: string) => {
    setSwitchedRegister(!switchedRegister)
    if (action == "inscreveu-se") {
      handleRegisterFromEvent(slug)
      toast.success("Inscrição realizada com sucesso!")
      return
    }
    handleUnresgiterFromEvent(slug)
      toast.info("Desinscrição realizada com sucesso!")
  }

  const getActionButton = (slug: string): ReactNode | undefined => {
    switch (eventFilter) {
      case "criados":
        return undefined;

      case "inscrito":
        return (
          <Button onClick={()=> handleOnClick("desinscreveu-se", slug)}>Desinscrever-se</Button>
        );

      default:
        return (
          <Button onClick={()=> handleOnClick("inscreveu-se", slug)}>Inscrever-se</Button>
        );
    }
  };

  return (
    <>
      {currentData?.length != 0 ? (
        <div className="w-full max-w-5xl mt-6">
          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-4">
            {currentData?.map((e) => (
              <EventCard
                key={e.Slug}
                slug={e.Slug}
                name={e.Name}
                local={e.location}
                start_date={e.start_date}
                end_date={e.end_date}
                description={e.description}
              />
            ))}
          </div>
        </div>
      ) : (
        <p className="mb-10">Sem eventos disponíveis nessa seção</p>
      )}
    </>
  );
};

export default EventListSection;
