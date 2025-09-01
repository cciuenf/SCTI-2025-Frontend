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
import { cn } from "@/lib/utils";

interface GenericModalProps {
  trigger?: React.ReactNode | null;
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
        { trigger === undefined ? ( <Button variant={"yellow"}>{title}</Button> ) : trigger}
      </DialogTrigger>
      <DialogContent className={cn(
        "max-h-[80vh] !max-w-screen w-fit min-h-80 overflow-y-auto",
        "min-w-[300px] md:min-w-[500px] lg:min-w-[800px] xl:min-w-[1000px]"
      )}>
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