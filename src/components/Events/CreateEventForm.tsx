"use client";
import React from "react";
import { EventCredentialsI } from "@/types/event-interfaces";
import { useRouter } from "next/navigation";
import CustomGenericForm, { FieldConfig } from "../ui/Generic/CustomGenericForm";
import { EventCreationDataI, eventCreationSchema } from "@/schemas/event-schema";
import { toast } from "sonner";

type Props = {
  event?: {
    name: string;
    description: string;
    slug: string;
    start_date: string | Date;
    end_date: string | Date;
    location: string;
    is_blocked: boolean;
    is_hidden: boolean;
    max_tokens_per_user: number;
  } | null;
  handleUpdate?: (data: Partial<EventCredentialsI>, slug: string) => any;
  handleCreate?: (data: EventCredentialsI) => any;
  type: "Create" | "Update";
  slug?: string;
};

const CreateEventForm = ({
  event,
  handleCreate,
  handleUpdate,
  type,
  slug,
}: Props) => {

  const router = useRouter()

  const onSubmit = async (values: EventCreationDataI) => {
    console.log(values)
    const convertedValues = {
      ...values,
      max_tokens_per_user: parseInt(values.max_tokens_per_user),
    };

    if (type === "Update" && slug && handleUpdate) {
      try {
        const result = await handleUpdate(convertedValues, slug);
        if (result.success) {
          console.log(result.data)
          toast.success(`Evento atualizado com sucesso: ${result.data.Name}`);
          router.push(`${result.data.Slug}`)
        } else {
          toast.error(`Falha na atualização do evento: ${result.data.Name}`);
        }
      } catch (error) {
        console.error("Error updating event:", error);
      }
    }
    if (handleCreate && type === "Create") {
      try {
        const result = await handleCreate(convertedValues);
        if (result.success) {
          toast.success("Evento criado com sucesso:", result.createdEventName);
        } else {
          toast.error("Falha na criação do evento:", result.createdEventName);
        }
      } catch (error) {
        console.error("Error creating event:", error);
      }
    }
  };

  const fields: FieldConfig<EventCreationDataI>[] = [
    {name: "name", label: "Nome", placeholder: "Coloque o nome do evento"},
    {name: "slug", label: "Sigla", placeholder: "Coloque a sigla referente ao evento"},
    {name: "location", label: "Local", placeholder: "Coloque o local que o evento irá acontecer"},
    {name: "description", label: "Descrição", placeholder: "Coloque a descrição do evento"},
    {name: "max_tokens_per_user", label: "Max Tokens Por User", placeholder: "Coloque o total de tokens por usuário", type: "text" as const},
    {name: "is_blocked", label: "O evento será bloqueado?", type: "switch" as const},
    {name: "is_hidden", label: "O evento será ocultado?", type: "switch" as const},
    {name: "start_date", label: "Coloque a data de início", type: "datetime" as const},
    {name: "end_date", label: "Coloque a data de fim", type: "datetime" as const},
  ]

  return (
    <div>
      <CustomGenericForm<EventCreationDataI>
        schema={eventCreationSchema}
        fields={fields}
        defaultValues={{
          name: event?.name || "",
          slug: event?.slug || "",
          location: event?.location || "",
          description: event?.description || "",
          start_date: event?.start_date || new Date(),
          end_date: event?.end_date || new Date(),
          is_blocked: event?.is_blocked || false,
          is_hidden: event?.is_hidden || false,
          max_tokens_per_user: event?.max_tokens_per_user.toString() || "0"
        }}
        onSubmit={onSubmit}
        submitLabel={type == "Create" ? "Criar" : "Editar"}
      />
    </div>
  );
};

export default CreateEventForm;
