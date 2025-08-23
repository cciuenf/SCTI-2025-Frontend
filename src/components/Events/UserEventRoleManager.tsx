"use client";
import CustomGenericModal from "../ui/Generic/CustomGenericModal";
import CustomGenericForm, {
  type FieldConfig,
} from "../ui/Generic/CustomGenericForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventRoleSchema, type EventRoleDataI } from "@/schemas/event-schema";

const UserEventRoleManager: React.FC<{
  slug: string;
  willPromote: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
  onRoleChange: (slug: string, email: string, willPromote: boolean) => void;
}> = ({ slug, open, setOpen, onRoleChange, willPromote }) => {

  const form = useForm<EventRoleDataI>({
    resolver: zodResolver(eventRoleSchema),
    defaultValues: {
      email: "",
    },
  });

  const fields: FieldConfig<EventRoleDataI>[] = [
    { name: "email", label: "E-mail", type: "email" as const },
  ];

  const handleSubmit = async (data: EventRoleDataI) => onRoleChange(slug, data.email, willPromote);

  return (
    <CustomGenericModal
      title="Gerenciar Papel do Usuário"
      description="Promover ou rebaixar um usuário no evento"
      open={open}
      onOpenChange={(open) => {setOpen(open);} }
      trigger={null}
    >
      <div className="flex flex-col gap-4">
        <CustomGenericForm<EventRoleDataI>
          schema={eventRoleSchema}
          fields={fields}
          defaultValues={form.getValues()}
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
          form={form}
          submitLabel={willPromote ? "Promover" : "Rebaixar"}
          submittingLabel="Processando..."
        />
      </div>
    </CustomGenericModal>
  );
};

export default UserEventRoleManager;
