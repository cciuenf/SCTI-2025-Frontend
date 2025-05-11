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
        <DialogTrigger className="bg-secondary text-accent rounded-md px-2 py-1 cursor-pointer">Open</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
          <CreateEventForm/>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateEventModal;
