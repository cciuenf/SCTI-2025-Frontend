"use client";
import type { EventResponseI } from "@/types/event-interfaces";
import { type EventCreationDataI, eventCreationSchema } from "@/schemas/event-schema";
import { toast } from "sonner";
import CustomGenericForm, { type FieldConfig } from "../ui/Generic/CustomGenericForm";
import { handleCreateEvent, handleUpdateSlugCreatedEvents } from "@/actions/event-actions";
import CustomGenericModal from "../ui/Generic/CustomGenericModal";
import { runWithToast } from "@/lib/client/run-with-toast";

const EventModalForm: React.FC<{ 
  isCreating: boolean,
  event?: EventResponseI
  onEventUpdate?: (updatedProduct: EventResponseI) => void,
  onEventCreate?: (newProduct: EventResponseI) => void,
  open: boolean,
  setOpen: (open: boolean) => void,
}> = ({ isCreating, event, onEventCreate, onEventUpdate, open, setOpen }) => {

  const handleSubmit = async (data: EventCreationDataI) => {
    if(isCreating) {
      const result = await runWithToast(
        handleCreateEvent(data),
        {
          loading: "Criando evento...",
          success: (res) =>
            res.data
              ? `Evento criado com sucesso: ${res.data.Name}`
              : 'Evento criado!',
          error: () => `Falha na criação do evento: ${data.name}`,
        }
      );
      if(result.success && result.data && onEventCreate) {
        onEventCreate(result.data);
        setOpen(false);
      }
    } else if(event) {
      const result = await runWithToast(
        handleUpdateSlugCreatedEvents(data, event.Slug),
        {
          loading: 'Atualizando evento...',
          success: (res) =>
            res.data
              ? `Evento atualizado com sucesso: ${res.data.Name}`
              : 'Evento atualizado!',
          error: () => `Falha na atualização do evento: ${data.name}`,
        }
      );
      if (result.success && result.data && onEventUpdate) {
        onEventUpdate(result.data);
        setOpen(false);
      } 
    } else toast.error("Evento Inválido");
  };

  const fields: FieldConfig<EventCreationDataI>[] = [
    {name: "name", label: "Nome", placeholder: "Coloque o nome do evento"},
    {name: "slug", label: "Sigla", placeholder: "Coloque a sigla referente ao evento"},
    {name: "location", label: "Local", placeholder: "Coloque o local que o evento irá acontecer"},
    {name: "description", label: "Descrição", placeholder: "Coloque a descrição do evento"},
    { 
      name: "max_tokens_per_user", 
      label: "Máximo de Tokens por Usuário", 
      type: "number" as const, 
      placeholder: "Coloque o total de tokens por usuário"
    },
    {name: "is_blocked", label: "O evento será bloqueado?", type: "switch" as const},
    {name: "is_hidden", label: "O evento será ocultado?", type: "switch" as const},
    {name: "start_date", label: "Coloque a data de início", type: "datetime" as const},
    {name: "end_date", label: "Coloque a data de fim", type: "datetime" as const},
  ]

  return (
    <div>
      <CustomGenericModal
        title={isCreating ? "Crie seu Evento" : "Altere seu Evento"}
        description={`Preencha os campos abaixo para que consiga ${isCreating ? "criar" : "alterar"} o evento desejado!`}
        open={open}
        onOpenChange={setOpen}
        trigger={null}
      >
        <CustomGenericForm<EventCreationDataI>
          schema={eventCreationSchema}
          fields={fields}
          defaultValues={{
            name: event?.Name || "",
            slug: event?.Slug || "",
            location: event?.location || "",
            description: event?.description || "",
            start_date: event?.start_date || new Date(),
            end_date: event?.end_date || new Date(),
            is_blocked: event?.is_blocked || false,
            is_hidden: event?.is_hidden || false,
            max_tokens_per_user: event?.max_tokens_per_user || 0
          }}
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
          submitLabel={isCreating ? "Criar" : "Editar"}
          submittingLabel={isCreating ? "Criando..." : "Editando..."}
        />
      </CustomGenericModal>
    </div>
  );
};

export default EventModalForm;
