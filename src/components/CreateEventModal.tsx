"use client"
import React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CreateEventForm from "./CreateEventForm";

type Props = {};

const CreateEventModal = (props: Props) => {
  return (
    <div className="mt-10">
      <Dialog>
        <DialogTrigger className="border-1 border-accent text-accent rounded-3xl px-2 py-1 cursor-pointer">Open</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crie seu evento</DialogTitle>
            <DialogDescription>
              Preencha todos os campos abaixo para que consiga criar o evento desejado!
            </DialogDescription>
          </DialogHeader>
          <CreateEventForm/>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateEventModal;
