"use client";
import React from "react";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import { Button } from "./ui/button";

type Props = {
  trigger: (onClick: (e: React.MouseEvent) => void) => React.ReactNode;
  message: string;
  onConfirm: () => Promise<void>;
  confirmText?: string;
  cancelText?: string;
  position?: string;
  disabled?: boolean;
};

const ConfirmActionButton = ({
  trigger,
  message,
  onConfirm,
  confirmText = "Sim",
  cancelText = "Não",
  disabled = false,
}: Props) => {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleConfirm = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    await onConfirm();
    setLoading(false);
    setOpen(false);
  };

  const handleCancel = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(false);
  };

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(true);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {trigger(handleTriggerClick)}
      </PopoverTrigger>
      <PopoverContent side="left" className="w-80 h-28" sideOffset={12}>
        <div className="w-full rounded-md flex flex-col items-center justify-around">
          <p className="text-sm text-center">{message}</p>
          <div className="flex justify-around items-center w-full mt-2 gap-2">
            <Button
              variant={"destructive"}
              onClick={handleConfirm}
              disabled={loading || disabled}
              tabIndex={0}
            >
              {loading ? "..." : confirmText}
            </Button>
            {cancelText && (
              <Button
                variant={"outline"}
                onClick={handleCancel}
                disabled={loading}
                tabIndex={0}
              >
                {cancelText}
              </Button>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ConfirmActionButton;
