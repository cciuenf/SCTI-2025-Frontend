"use client";

import { useRef, useState } from "react";
import { Dialog, DialogTrigger, DialogClose, DialogContent } from "./ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import { Button } from "./ui/button";

export default function CameraComponent() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isStreamActive, setIsStreamActive] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const isMobile = useIsMobile();

  const openCamera = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const constraints = {
          video: { facingMode: isMobile ? "user" : "environment" },
          autoPlay: true,
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setIsStreamActive(true);
        }
      } else {
        toast.error("O navegador não suporta a ativação de câmera.");
      }
    } catch (err) {
      console.error("Erro ao acessar a câmera:", err);
      toast.error("Erro ao acessar a câmera. Verifique as permissões.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();

      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsStreamActive(false);
    }
  };

  const handleDialogClose = () => {
    stopCamera();
  };

  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open);

    if (!open) {
      handleDialogClose();
    }
  };

  return (
    <div>
      {
        <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger onClick={openCamera}asChild className="w-full">
            <Button type="button" variant="ghost">
              Escanear Participante
            </Button>
          </DialogTrigger>
          <DialogContent className="h-[600px] w-4/5 flex flex-col items-center ml-[-15px] xs:ml-0">
            <DialogTitle className="text-3xl text-center">
              Escaneie o QR code
            </DialogTitle>
            <video
              ref={videoRef}
              className="w-[340px] h-[480px] border-2 border-gray-300 object-cover rounded-lg shadow-lg"
            />
          </DialogContent>
        </Dialog>
      }
    </div>
  );
}
