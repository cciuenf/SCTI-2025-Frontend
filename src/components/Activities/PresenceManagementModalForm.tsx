"use client";
import type { ActivityRegistrationI } from "@/types/activity-interface";
import CustomGenericModal from "../ui/Generic/CustomGenericModal";
import type { UserBasicInfo } from "@/types/auth-interfaces";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { handleGetUsersInfo } from "@/actions/user-actions";
import { 
  handleGetRegisteredUsersInActivity, 
  handleMarkAttendanceOfActivity, 
  handleRemoveAttendanceOfActivity 
} from "@/actions/activity-actions";
import { Select } from "../ui/select";
import LoadingSpinner from "../Loading/LoadingSpinner";
import { Button } from "../ui/button";
import CameraComponent from "../CameraComponent";
import type { ActionResult } from "@/actions/_utils";
import { runWithToast } from "@/lib/client/run-with-toast";

interface Props {
  activityId: string;
  activityName: string;
  slug: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

type Combined = UserBasicInfo & ActivityRegistrationI;

const PresenceManagmentModalForm = ({
  activityId,
  activityName,
  slug,
  open,
  setOpen,
}: Props) => {
  const [usersRegistrations, setUsersRegistrations] = useState<
    (UserBasicInfo & ActivityRegistrationI)[]
  >([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(true);

  const loadUsers = useCallback(async (): Promise<ActionResult<Combined[]>> => {
    const regRes = await handleGetRegisteredUsersInActivity({ id: activityId }, slug);
    if (!regRes.success || !regRes.data)
      return { success: false, data: null, message: regRes.message ?? 'Falha inesperada' };

    const registrations = regRes.data as ActivityRegistrationI[];
    if (registrations.length === 0)
      return { success: true, data: [], message: 'Nenhum usuário encontrado' };

    const ids = registrations.map(r => r.user_id);
    const usersRes = await handleGetUsersInfo({ id_array: ids });
    if (!usersRes.success || !usersRes.data)
      return { success: false, data: null, message: usersRes.message ?? 'Falha ao ler usuários' };
    
    const users = usersRes.data;

    const combined = registrations.map((reg, idx) => ({
      ...reg,
      ...users[idx]
    }));
    return { success: true, data: combined, message: 'Usuários carregados' };
  }, [activityId, slug]);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    const res = await runWithToast(loadUsers(), {
      loading: 'Carregando usuários...',
      success: () => 'Usuários carregados',
      error: () => 'Erro ao carregar usuários',
    });
    if (res.success && res.data) setUsersRegistrations(res.data);
    setIsLoading(false);
    setIsSubmitting(false);
  }, [loadUsers]);

  useEffect(() => {
    if (open) {
      setUsersRegistrations([]);
      setSelectedUserId('');
      fetchUsers();
    } else {
      setUsersRegistrations([]);
      setSelectedUserId('');
    }
  }, [open, fetchUsers]);

  const selectedRecord = useMemo(
    () => usersRegistrations.find(r => r.user_id.toString() === selectedUserId),
    [usersRegistrations, selectedUserId]
  );
  const hasAttended = Boolean(selectedRecord?.attended_at);

  const handlePresence = useCallback(async () => {
    if (!selectedUserId) {
      toast.error("Selecione um participante");
      return;
    }
    setIsSubmitting(true);

    const action = hasAttended
      ? handleRemoveAttendanceOfActivity({ activity_id: activityId, user_id: selectedUserId }, slug)
      : handleMarkAttendanceOfActivity({ activity_id: activityId, user_id: selectedUserId }, slug);

    const res = await runWithToast(action, {
      loading: hasAttended ? 'Removendo presença...' : 'Marcando presença...',
      success: () => hasAttended ? 'Presença removida com sucesso' : 'Presença marcada com sucesso',
      error: () => 'Erro ao atualizar presença',
    });

    if (res.success) {
      setUsersRegistrations(prev =>
        prev.map(r =>
          r.user_id.toString() === selectedUserId
            ? { ...r, attended_at: hasAttended ? null : new Date().toISOString() }
            : r
        )
      );
    }
    setIsSubmitting(false);
  }, [hasAttended, selectedUserId, activityId, slug]);

  return (
    <CustomGenericModal
      title={`Gerencie as Presenças da atividade: ${activityName}`}
      description="Adicione ou remova a presença do usuário selecionado"
      open={open}
      onOpenChange={setOpen}
      trigger={null}
    >
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="flex flex-col justify-center gap-5">
          <CameraComponent
            setSelectedUserId={setSelectedUserId}
            userRegistrations={usersRegistrations}
          />
          <Select
            placeholder="Selecione o Participante"
            options={usersRegistrations.map((reg) => ({
              label: `${reg.Name} ${reg.LastName}`,
              value: reg.user_id,
            }))}
            value={selectedUserId}
            onValueChange={setSelectedUserId}
          />
          <Button
            type="button"
            onClick={handlePresence}
            variant={hasAttended ? "destructive" : "default"}
            disabled={isSubmitting || !selectedUserId}
          >
            {isSubmitting && hasAttended 
              ? "Removendo..."  : isSubmitting 
              ? "Marcando..." : hasAttended   
              ? "Remover Presença" : "Marcar Presença"
            }
          </Button>
        </div>
      )}
    </CustomGenericModal>
  );
};

export default PresenceManagmentModalForm;
