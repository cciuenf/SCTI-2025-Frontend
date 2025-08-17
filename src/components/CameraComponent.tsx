"use client";

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Dialog, DialogTrigger, DialogContent } from "./ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import { Button } from "./ui/button";
import QrScanner from "qr-scanner";
import { ActivityRegistrationI } from "@/types/activity-interface";
import { UserBasicInfo } from "@/types/auth-interfaces";

interface Props {
  setSelectedUserId: Dispatch<SetStateAction<string>>;
  userRegistrations: (UserBasicInfo & ActivityRegistrationI)[];
}

export default function CameraComponent({
  setSelectedUserId,
  userRegistrations,
}: Props) {
  const usersIdInActivity = userRegistrations.map((m) => m.user_id);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isStreamActive, setIsStreamActive] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [qrScanner, setQrScanner] = useState<QrScanner | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>();

  const isMobile = useIsMobile();

  const openCamera = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast.error("Seu navegador não suporta acesso à câmera!");
        return;
      }

      const hasCamera = await QrScanner.hasCamera();

      if (!hasCamera) {
        toast.error("Nenhuma câmera foi identificada!");
        return;
      }

      const constraints = {
        video: {
          facingMode: isMobile ? "user" : "environment",
          width: { ideal: 320, max: 1280 },
          height: { ideal: 480, max: 720 },
        },
        autoPlay: true,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsStreamActive(true);

        initQrScanner();
      }
    } catch (err: any) {
      switch (err.name) {
        case "NotAllowedError":
          toast.error(
            "Permissão de câmera negada. Permita o acesso e tente novamente."
          );
          break;
        case "NotFoundError":
          toast.error("Nenhuma câmera encontrada.");
          break;
        case "NotSupportedError":
          toast.error("Câmera não suportada no navegador.");
          break;
        default:
          toast.error("Erro ao acessar a câmera, verifique as permissões.");
      }
    }
  };

  const initQrScanner = () => {
    if (videoRef.current) {
      const scanner = new QrScanner(
        videoRef.current,
        (result) => onQrCodeDetected(result.data),
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
          maxScansPerSecond: 1,
          returnDetailedScanResult: true,
        }
      );

      setQrScanner(scanner);

      // Verificar compatibilidade antes de iniciar
      QrScanner.hasCamera().then((hasCamera) => {
        if (hasCamera) {
          scanner
            .start()
            .then(() => {
              setIsScanning(true);
              console.log("Scanner de QR code iniciado");

              Object.defineProperty(document, "hidden", {
                value: true,
                configurable: true,
              });
              document.dispatchEvent(new Event("visibilitychange"));

              // Depois simular volta à página
              setTimeout(() => {
                Object.defineProperty(document, "hidden", {
                  value: false,
                  configurable: true,
                });
                document.dispatchEvent(new Event("visibilitychange"));
              }, 100);
            })
            .catch((error) => {
              toast.error("Erro ao iniciar o scanner de QR code");
              // Fallback: tentar novamente com configurações mais básicas
              setTimeout(() => initBasicScanner(), 1000);
            });
        } else {
          toast.error("Nenhuma câmera foi encontrada no dispositivo");
        }
      });
    }
  };

  // Scanner básico como fallback
  const initBasicScanner = () => {
    if (videoRef.current && !qrScanner) {
      const scanner = new QrScanner(
        videoRef.current,
        (result) => onQrCodeDetected(result.data),
        {
          // Configurações mínimas para máxima compatibilidade
          maxScansPerSecond: 1,
          highlightScanRegion: false,
          highlightCodeOutline: false,
        }
      );

      setQrScanner(scanner);
      scanner
        .start()
        .then(() => {
          setIsScanning(true);
          toast.info("Scanner iniciado em modo básico");
        })
        .catch((error) => {
          console.error("Erro no scanner básico:", error);
          toast.error("Dispositivo não suportado para escaneamento");
        });
    }
  };

  const onQrCodeDetected = (qrCodeData: string) => {
    handleScan(qrCodeData);

    if (qrScanner) {
      qrScanner.stop();
      qrScanner.destroy();
      setQrScanner(null);
      setIsScanning(false);
    }

    setIsDialogOpen(false);
  };

  const handleScan = (qrId: string) => {
    const isInActivity = usersIdInActivity.some((userId) => userId == qrId);

    if (isInActivity) {
      toast.success("Usuário encontrado na atividade!");
      setSelectedUserId(qrId);
    }

    if (!isInActivity) {
      toast.error("Usuário não encontrado na atividade!");
    }
  };

  const stopCamera = () => {
    if (qrScanner) {
      qrScanner.stop();
      qrScanner.destroy();
      setQrScanner(null);
      setIsScanning(false);
    }

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

  useEffect(() => {
    return () => {
      if (qrScanner) {
        qrScanner.stop();
        qrScanner.destroy();
      }
    };
  }, [qrScanner]);

  return (
    <div>
      <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger onClick={openCamera} asChild className="w-full">
          <Button type="button" variant="ghost">
            Escanear Participante
          </Button>
        </DialogTrigger>
        <DialogContent className="h-[620px] w-full flex flex-col items-center">
          <DialogTitle className="text-3xl text-center">
            Escaneie o QR code
          </DialogTitle>
          <div className="relative">
            <video
              autoPlay
              playsInline
              ref={videoRef}
              width={320}
              height={480}
              className="w-[320px] h-[480px] border-2 border-gray-300 object-cover rounded-lg shadow-lg"
            />
          </div>
          <p className="text-sm text-gray-600 text-center mt-2">
            Posicione o QR code na frente da câmera
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
