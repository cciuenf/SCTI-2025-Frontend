"use client";

import { CheckCircle, Pencil, UserPlus, UserX } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useUserEvents } from "@/contexts/UserEventsProvider";
import LoadingSpinner from "../Loading/LoadingSpinner";
import type { EventCoffeeBreakResponseI, EventResponseI } from "@/types/event-interfaces";
import EventModalForm from "./EventModalForm";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CustomGenericModal from "../ui/Generic/CustomGenericModal";
import { handleGetAllCoffeeBreak, handleGetAllRegistrationsFromCoffee, handleRegisterUserInCoffeeBreak, handleUnregisterUserInCoffeeBreak } from "@/actions/event-actions";
import CameraComponent from "../CameraComponent";
import EventCoffeeBreakForm from "./EventCoffeeBreakForm";
import { Select } from "../ui/select";
import { formatBRDateTime, safeTime } from "@/lib/date-utils";
import { runWithToast } from "@/lib/client/run-with-toast";
import UserCoffeeInfoTable from "./Slug/UserCoffeeInfoTable";

interface Props {
  isEventCreator: boolean;
  isAdminStatus: { isAdmin: boolean, type: "admin" | "master_admin" | "" }
  event: EventResponseI;
}

const EventManagementActions = ({ isEventCreator, isAdminStatus, event }: Props) => {
  const [isEditEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isLoadingRegisterState, setIsLoadingRegisterState] = useState(false);
  const [isCheckPaidModalOpen, setIsCheckPaidModalOpen] = useState(false);
  const [userIdToCheck, setUserIdToCheck] = useState<string>("");

  const [selectedCoffeeId, setSelectedCoffeeId] = useState<string>("");
  const [coffeeBreaks, setCoffeBreaks] = useState<EventCoffeeBreakResponseI[]>([])
  const [isLoadingCoffeeRegistrations, setIsLoadingCoffeeRegistrations] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [isUsersModalOpen, setIsUsersModalOpen] = useState(false);

  const {
    myEvents,
    allEvents,
    handleRegister,
    handleUnregister,
    isLoading,
    handleEventUpdate,
  } = useUserEvents();
  const updatedEvent = allEvents.find((e) => e.Slug === event.Slug) || event;
  const router = useRouter();


  useEffect(() => {
    const loadAllCoffeBreaks = async () => {
      const res = await handleGetAllCoffeeBreak(event.Slug);
      setCoffeBreaks(res.data || []);
    }
    loadAllCoffeBreaks();
  }, [event.Slug]);

  const loadAllCoffeBreaksRegistrations = useCallback(async (coffeeId: string) => {
    if (!coffeeId) return;
    setIsLoadingCoffeeRegistrations(true);

    const res = await handleGetAllRegistrationsFromCoffee(event.Slug, coffeeId);
    console.log(res);
    if (res.success && res.data != null) {
      setCoffeBreaks(prev =>
        prev.map(cb =>
          cb.id === coffeeId
            ? { ...cb, registrations: res.data ?? [] }
            : cb
        )
      );
    }

    setIsLoadingCoffeeRegistrations(false);
  }, [event.Slug]);


  useEffect(() => {
    if(selectedCoffeeId.length > 0) loadAllCoffeBreaksRegistrations(selectedCoffeeId);
  }, [event.Slug, loadAllCoffeBreaksRegistrations, selectedCoffeeId])

  if (isLoading) {
    return (
      <div className="w-full max-w-5xl mt-6">
        <LoadingSpinner />
      </div>
    );
  }

  const isSubscribed = myEvents.find((e) => e.Slug === updatedEvent.Slug);
  const currentCoffee = coffeeBreaks.find(c => c.id === selectedCoffeeId);
  const currentRegistration = currentCoffee?.registrations?.find(
    r => r.user_id === userIdToCheck
  );
  const isValidated = Boolean(currentRegistration);//Boolean(currentRegistration?.attended_at);
  console.log(currentRegistration);
  console.log(isValidated);
  const buttonLabel = isValidated ? "Remover validação" : "Validar";

  const handleCoffeeCreated = (newCoffee: EventCoffeeBreakResponseI) => {
    setCoffeBreaks(prevCoffees => [...prevCoffees, newCoffee]);
  }

  const handleCoffeeUpdated = (updatedCoffee: EventCoffeeBreakResponseI) => {
    setCoffeBreaks(prevCoffees =>
      prevCoffees.map(e => e.id === updatedCoffee.id ? updatedCoffee : e)
    );
  }

  const handleCoffeeValidation = async () => {
    if (!selectedCoffeeId || !userIdToCheck.trim()) return;
    console.log(isValidated);
    console.log(currentCoffee)
    console.log(currentRegistration)
    setIsMutating(true);
    await runWithToast(
      isValidated ? handleUnregisterUserInCoffeeBreak(event.Slug, userIdToCheck, selectedCoffeeId) :
        handleRegisterUserInCoffeeBreak(event.Slug, userIdToCheck, selectedCoffeeId),
      { 
        loading: `${isValidated ? "Desregistrado" : "Registrando"} o usuário no Coffee`,
        success: () => `Usuário ${isValidated ? "desregistrado" : "registrado"} no Coffee`,
        error: () => `Erro ao ${isValidated ? "desregistrar" : "registrar"} o Usuário no Coffee`
      }
    );
    await loadAllCoffeBreaksRegistrations(selectedCoffeeId);
    setIsMutating(false);
  }

  const handleRegisterState = async () => {
    if (!handleRegister || !handleUnregister) return;
    setIsLoadingRegisterState(true);
    
    if (isSubscribed) await handleUnregister(updatedEvent.Slug);
    else await handleRegister(updatedEvent.Slug);
    
    setIsLoadingRegisterState(false);
    router.push(`/events/${updatedEvent}`); // This needs to improve
  };

  const baseOptions = coffeeBreaks.map((item) => ({
    label: formatBRDateTime(safeTime(item.start_date)),
    value: item.id,
  }));

  const options = (isEventCreator || isAdminStatus.type === "master_admin")
    ? [{ label: "Apenas Criação", value: "" }, ...baseOptions]
    : baseOptions;


  return (
    <section className="w-full max-w-sm mx-auto flex flex-col items-stretch gap-3 px-4">
      <Button
        onClick={handleRegisterState}
        disabled={isLoadingRegisterState}
        title={isSubscribed ? "Cancelar inscrição" : "Inscrever-se"}
        className={cn(
          "inline-flex w-full items-center justify-center gap-2",
          "h-12 px-4 text-base font-semibold rounded-md shadow-md transition-colors",
          "disabled:opacity-60 disabled:pointer-events-none",
          isSubscribed
            ? "bg-white text-red-600 border border-red-500 hover:bg-red-50 hover:text-red-600"
            : "bg-accent text-secondary hover:text-accent hover:bg-secondary"
        )}
      >
        {isSubscribed ? <UserX className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
        {isSubscribed ? "Cancelar inscrição" : "Inscrever-se"}
      </Button>
      {(isEventCreator || isAdminStatus.type == "master_admin") && (
        <Button
          onClick={() => setIsEventModalOpen(true)}
          title="Editar evento"
          variant="outline"
          className={cn(
            "inline-flex w-full items-center justify-center gap-2",
            "h-10 px-3 text-sm font-medium rounded-md shadow-sm transition-colors",
            "text-gray-800 border border-gray-200 hover:border-accent"
          )}
        >
          <Pencil className="w-4 h-4" />
          Editar
        </Button>
      )}
      {(isEventCreator || isAdminStatus.isAdmin) && (
        <Button
          onClick={() => setIsCheckPaidModalOpen(true)}
          title="Foi Pago?"
          variant="outline"
          className={cn(
            "inline-flex w-full items-center justify-center gap-2",
            "h-10 px-3 text-sm font-medium rounded-md shadow-sm transition-colors",
            "text-gray-800 border border-secondary hover:border-accent"
          )}
        >
          <CheckCircle className="w-4 h-4" />
          Verificar se foi pago
        </Button>
      )}
      <EventModalForm
        event={updatedEvent}
        isCreating={false}
        open={isEditEventModalOpen}
        setOpen={setIsEventModalOpen}
        onEventUpdate={handleEventUpdate}
      />

      <CustomGenericModal
        title="Verfique se o usuário pagou"
        open={isCheckPaidModalOpen}
        onOpenChange={setIsCheckPaidModalOpen}
        trigger={null}
      >
        <Select 
          placeholder="Selecione..."
          value={selectedCoffeeId}
          options={options}
          className="max-h-12"
          onValueChange={setSelectedCoffeeId}
        />
        {(isEventCreator || isAdminStatus.type === "master_admin") &&
          <EventCoffeeBreakForm
            key={selectedCoffeeId || "new"} 
            isCreating={coffeeBreaks.find(item => item.id === selectedCoffeeId) ? false : true}
            slug={event.Slug}
            coffee={coffeeBreaks.find(item => item.id === selectedCoffeeId)}
            onCoffeeCreate={handleCoffeeCreated}
            onCoffeeUpdate={handleCoffeeUpdated}
          />
        }
        {selectedCoffeeId.length > 0 &&
          <>
            <CameraComponent
              setSelectedUserId={setUserIdToCheck}
              mode="status"
            />
            <Button 
              type="button" 
              variant="default" 
              className="min-w-28 h-12" 
              disabled={userIdToCheck.trim().length === 0 || isLoadingCoffeeRegistrations || isMutating}
              onClick={() => handleCoffeeValidation()}
            >
              {buttonLabel}
            </Button>
            <UserCoffeeInfoTable
              registrations={currentCoffee?.registrations || []}
              open={isUsersModalOpen}
              setOpen={setIsUsersModalOpen}
            />
          </> 
        }
      </CustomGenericModal>
    </section>
  );
};

export default EventManagementActions;
