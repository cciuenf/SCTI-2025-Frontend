"use client";
import CustomGenericModal from "../ui/Generic/CustomGenericModal";
import CustomGenericForm, {FieldConfig} from "../ui/Generic/CustomGenericForm";
import { ActivityResponseI } from "@/types/activity-interface";
import { ActivityCreationDataI, activityCreationSchema } from "@/schemas/activity-schema";
import { handleCreateActivity, handleUpdateActivity } from "@/actions/activity-actions";
import { toast } from "sonner";

const ActivityModalForm: React.FC<{ 
  currentEvent: { id: string; slug: string }
  isCreating: boolean,
  activity?: ActivityResponseI,
  onActivityUpdate?: (updatedProduct: ActivityResponseI) => void,
  onActivityCreate?: (newProduct: ActivityResponseI) => void,
  open: boolean,
  setOpen: (open: boolean) => void,
}> = ({ isCreating, currentEvent, activity, onActivityCreate, onActivityUpdate, open, setOpen }) => {

  const fields: FieldConfig<ActivityCreationDataI>[] = [
    { name: "name", label: "Nome", placeholder: "Nome do Evento" },
    { name: "speaker", label: "Speaker", placeholder: "Informe o palestrante" },
    { name: "location", label: "Localização", placeholder: "Informe a localização" },
    { name: "type", label: "Tipo do Evento", placeholder: "Informe o tipo do evento" },
    { name: "description", label: "Descrição", placeholder: "Coloque a descrição do evento" },
    { name: "is_standalone", label: "É independente?", type: "switch" as const },
    { 
      name: "standalone_slug", 
      label: "Sigla", 
      placeholder: "Sigla da Atividade Independente",
      disabledWhen: {
        field: "is_standalone",
        value: false
      }
    },
    { name: "has_unlimited_capacity", label: "Há vagas ilimitadas?", type: "switch" as const },
    { 
      name: "max_capacity", 
      label: "Capacidade", 
      type: "number" as const, 
      placeholder: "0",
      disabledWhen: {
        field: "has_unlimited_capacity",
        value: true
      }
    },
    { name: "has_fee", label: "Tem taxa?", type: "switch" as const },
    { name: "is_mandatory", label: "É obrigatório?", type: "switch" as const },
    { name: "is_blocked", label: "Está bloqueado?", type: "switch" as const },
    { name: "is_hidden", label: "Está oculto?", type: "switch" as const },
    { 
      name: "start_time", 
      label: "Data de Início", 
      type: "datetime" as const,
      placeholder: "Selecione a data de Início da Atividade"
    },
    { 
      name: "end_time", 
      label: "Data de Finalização", 
      type: "datetime" as const,
      placeholder: "Selecione a data de Finalização da Atividade"
    },
  ];

  const handleSubmit = async (data: ActivityCreationDataI) => {
    try {
      if(isCreating) {
        const result = await handleCreateActivity(data, currentEvent.slug);
        if (result?.success && result.data && onActivityCreate) {
          setOpen(false);
          onActivityCreate(result.data);
        }
      } else if(activity) {
        const result = await handleUpdateActivity(data, currentEvent.slug, activity.ID);
        if (result?.success && result.data && onActivityUpdate) {
          setOpen(false);
          onActivityUpdate(result.data);
        }
      } else toast.error("Atividade Inválida")
    } catch (error) {
      toast.error(`Erro ao manipular Atividade: ${data.name}`);
    }
  };

  return (
    <CustomGenericModal
      title={isCreating ? "Crie sua Atividade" : "Altere sua Atividade"}
      description={`Preencha os campos abaixo para que consiga ${isCreating ? "criar" : "alterar"} a atividade desejada!`}
      open={open}
      onOpenChange={setOpen}
      trigger={null}
    >
      <CustomGenericForm<ActivityCreationDataI> 
        schema={activityCreationSchema} 
        fields={fields} 
        defaultValues={activity || {
          name: "", 
          description: "", 
          speaker: "",
          location: "",
          standalone_slug: "",
          type: "",
          has_unlimited_capacity: false, 
          max_capacity: 0,
          has_fee: false,
          is_standalone: false,
          is_blocked: false,
          is_hidden: false,
          is_mandatory: false,
          start_time: new Date(),
          end_time: new Date(),
        }}
        onSubmit={handleSubmit}
        onCancel={() => setOpen(false)}
      />
    </CustomGenericModal>
  );
};

export default ActivityModalForm;
