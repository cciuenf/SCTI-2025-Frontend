"use client";
import { type EventCoffeeBreakDataI, eventCoffeeBreakSchema} from "@/schemas/event-schema";
import CustomGenericForm, { type FieldConfig } from "../ui/Generic/CustomGenericForm";
import { addHours } from "date-fns";
import { runWithToast } from "@/lib/client/run-with-toast";
import { handleCreateCoffeeBreak, handleUpdateCoffeeBreak } from "@/actions/event-actions";
import type { EventCoffeeBreakResponseI } from "@/types/event-interfaces";

const EventCoffeeBreakForm: React.FC<{ 
  isCreating: boolean,
  slug: string,
  coffee?: EventCoffeeBreakResponseI
  onCoffeeUpdate: (updatedCoffee: EventCoffeeBreakResponseI) => void,
  onCoffeeCreate: (newCoffee: EventCoffeeBreakResponseI) => void,
}> = ({ isCreating, slug, coffee, onCoffeeCreate, onCoffeeUpdate }) => {

  const handleSubmit = async (data: EventCoffeeBreakDataI) => {
    if(isCreating) {
      const res = await runWithToast(
        handleCreateCoffeeBreak(slug, data),
        {
          loading: "Criando o Coffee Break",
          success: () => "Coffee Break criado com sucesso!",
          error: () => "Houve um erro ao criar o Coffee Break"
        }
      )
      if(res.success && res.data && onCoffeeCreate) onCoffeeCreate(res.data);
    } else if(coffee) {
      const res = await runWithToast(
        handleUpdateCoffeeBreak(slug, coffee.id, data),
        {
          loading: "Atualizando o Coffee Break",
          success: () => "Coffee Break atualizado com sucesso!",
          error: () => "Houve um erro ao atualizar o Coffee Break"
        }
      )
      if(res.success && res.data && onCoffeeUpdate) onCoffeeUpdate(res.data)
    }
  };

  const fields: FieldConfig<EventCoffeeBreakDataI>[] = [
    {name: "start_date", label: "Coloque a data de início", type: "datetime" as const},
    {name: "end_date", label: "Coloque a data de fim", type: "datetime" as const},
  ]

  return (
    <div>
      <CustomGenericForm<EventCoffeeBreakDataI>
        schema={eventCoffeeBreakSchema}
        fields={fields}
        defaultValues={{
          start_date: coffee?.start_date || new Date(),
          end_date: coffee?.end_date || addHours(new Date(), 1),
        }}
        onSubmit={handleSubmit}
        submitLabel={isCreating ? "Criar" : "Editar"}
        submittingLabel={isCreating ? "Criando..." : "Editando..."}
      />
    </div>
  );
};

export default EventCoffeeBreakForm;
