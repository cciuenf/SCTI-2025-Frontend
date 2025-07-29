"use client";
import { ActivityRegistrationI } from "@/types/activity-interface";
import CustomGenericModal from "../ui/Generic/CustomGenericModal";
import { UserBasicInfo } from "@/types/auth-interfaces";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { handleGetUsersInfo } from "@/actions/user-actions";
import { handleGetRegisteredUsersInActivity, handleMarkAttendanceOfActivity, handleRemoveAttendanceOfActivity } from "@/actions/activity-actions";
import { Select } from "../ui/select";
import LoadingSpinner from "../Loading/LoadingSpinner";
import { Button } from "../ui/button";

interface Props {
  activityId: string;
  activityName: string;
  slug: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const PresenceManagmentModalForm = ({ activityId, activityName, slug, open, setOpen }: Props) => {
  const [usersRegistrations, setUsersRegistrations] = useState<
    (UserBasicInfo & ActivityRegistrationI)[]
  >([])
  const [selectedUserId, setSelectedUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(true);

    const fetchUsers = async () => {
    try {
      setLoading(true);
      const result = await handleGetRegisteredUsersInActivity({ id: activityId }, slug);
      const registrations = result.data;
      if(result.success && registrations) {
        const userIds = registrations.map(reg => reg.user_id);
        const usersResult = await handleGetUsersInfo({id_array: userIds});
        if(usersResult.success && usersResult.data) {
          const users = usersResult.data;
          const combined = registrations.map((reg, idx) => ({
            ...reg,
            ...users[idx]
          }));
          setUsersRegistrations(combined);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar os usuários:", error);
      toast.error("Erro ao carregar os usuários");
    } finally { 
      setLoading(false); 
      setSubmitting(false);
    }
  }

  useEffect(() => {
    if(open) fetchUsers();
    else {
      setUsersRegistrations([]);
      setSelectedUserId("");
    }
  }, [activityName, open])

  const selectedRecord = usersRegistrations.find(
    (r) => r.user_id.toString() === selectedUserId
  );
  const hasAttended = Boolean(selectedRecord?.attended_at);

  const handlePresence = async () => {
    if (!selectedUserId) {
      toast.error("Selecione um participante");
      return;
    }
    setSubmitting(true);
    try {
      let res;
      if (hasAttended) {
        res = await handleRemoveAttendanceOfActivity(
          { activity_id: activityId, user_id: selectedUserId },
          slug
        );
      } else {
        res = await handleMarkAttendanceOfActivity(
          { activity_id: activityId, user_id: selectedUserId },
          slug
        );
      }
      if (res.success) {
        toast.success(hasAttended ? "Presença removida com sucesso" : "Presença marcada com sucesso",
          { description: res.message }
        );
        setUsersRegistrations((prev) =>
          prev.map((r) => r.user_id.toString() === selectedUserId
            ? { ...r, attended_at: hasAttended ? null : new Date().toISOString() } : r
          )
        );
      } else {
        toast.error("Erro ao atualizar presença", { description: res.message });
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro desconhecido ao atualizar presença");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CustomGenericModal
      title={`Gerencie as Presenças da atividade: ${activityName}`}
      description="Adicione ou remova a presença do usuário selecionado"
      open={open}
      onOpenChange={setOpen}
      trigger={null}
    >
    {loading ? <LoadingSpinner /> :
      <div className="flex flex-col justify-center gap-5">
        <Button type="button" variant="ghost">
          Escanear Participante
        </Button>
        <Select
          placeholder="Selecione o Participante"
          options={usersRegistrations.map(reg => ({
            label: `${reg.Name} ${reg.LastName}`, value: reg.user_id
          }))} 
          value={selectedUserId}
          onValueChange={setSelectedUserId}
        />
        <Button 
          type="button"
          onClick={handlePresence} 
          variant={hasAttended ? 'destructive' : 'default'} 
          disabled={submitting || !selectedUserId}
        >
          {submitting ? "Enviando..." : hasAttended ? "Remover Presença" : "Marcar Presença"}
        </Button>
      </div>
    }
    </CustomGenericModal>
  )
}

export default PresenceManagmentModalForm;