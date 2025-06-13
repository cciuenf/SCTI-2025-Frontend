import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../button";

interface GenericModalProps {
  trigger?: React.ReactNode;
  title: string;
  description?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

const CustomGenericModal: React.FC<GenericModalProps> = ({
  trigger, title, description, open, onOpenChange, children 
}) => {

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>          
        { trigger || ( <Button variant={"yellow"}>{title}</Button> )}
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default CustomGenericModal;