"use client";
import { EventResponseI } from "@/types/event-interfaces";
import { EventCreationDataI, eventCreationSchema } from "@/schemas/event-schema";
import { toast } from "sonner";
import CustomGenericForm, { FieldConfig } from "../ui/Generic/CustomGenericForm";
import { handleCreateEvent, handleUpdateSlugCreatedEvents } from "@/actions/event-actions";
import CustomGenericModal from "../ui/Generic/CustomGenericModal";

const EventModalForm: React.FC<{ 
  isCreating: boolean,
  event?: EventResponseI
  onEventUpdate?: (updatedProduct: EventResponseI) => Promise<void>,
  onEventCreate?: (newProduct: EventResponseI) => Promise<void>,
  open: boolean,
  setOpen: (open: boolean) => void,
}> = ({ isCreating, event, onEventCreate, onEventUpdate, open, setOpen }) => {

  const handleSubmit = async (data: EventCreationDataI) => {
    try {
      if(isCreating) {
        const result = await handleCreateEvent(data);
        if (result?.success && result.data && onEventCreate) {
          await onEventCreate(result.data);
          setOpen(false);
          toast.success(`Evento criado com sucesso: ${result.data.Name}`, {
            description: result.data.description
          });
        }
      } else if(event) {
        const result = await handleUpdateSlugCreatedEvents(data, event.Slug);
        if (result?.success && result.data && onEventUpdate) {
          setOpen(false);
          await onEventUpdate(result.data);
          toast.success(`Evento atualizado com sucesso: ${result.data.Name}`);
        }
      } else toast.error("Evento Inválido");
    } catch (error) {
      toast.error(`Falha na atualização do evento: ${data.name}`);
    }
  };

  const fields: FieldConfig<EventCreationDataI>[] = [
    {name: "name", label: "Nome", placeholder: "Coloque o nome do evento"},
    {name: "slug", label: "Sigla", placeholder: "Coloque a sigla referente ao evento"},
    {name: "location", label: "Local", placeholder: "Coloque o local que o evento irá acontecer"},
    {name: "description", label: "Descrição", placeholder: "Coloque a descrição do evento"},
    { 
      name: "max_tokens_per_user", 
      label: "Max Tokens Por User", 
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
        />
      </CustomGenericModal>
    </div>
  );
};

export default EventModalForm;
