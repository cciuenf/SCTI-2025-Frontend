import { useCallback, useEffect, useState } from "react";
import CustomGenericModal from "../ui/Generic/CustomGenericModal"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import LoadingSpinner from "../Loading/LoadingSpinner";
import type { UserBasicInfo } from "@/types/auth-interfaces";
import { 
  handleGetRegisteredUsersInActivity, 
  handleGetUsersWhoParticipateInActivity 
} from "@/actions/activity-actions";
import type { ActivityRegistrationI } from "@/types/activity-interface";
import { handleGetUsersInfo } from "@/actions/user-actions";
import { formatFullDate } from "@/lib/utils";
import type { ActionResult } from "@/actions/_utils";
import { runWithToast } from "@/lib/client/run-with-toast";

interface Props {
  activityId: string;
  activityName: string;
  slug: string;
  isRegistrations: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
}

type Combined = UserBasicInfo & ActivityRegistrationI;

const UserActivityInfoTable = ({ 
  activityId, 
  activityName, 
  slug, 
  isRegistrations, 
  open, 
  setOpen 
}: Props) => {
  const [usersRegistrations, setUsersRegistrations] = useState<Combined[]>([])
  const [loading, setLoading] = useState(true);

  const loadRegistrationsWithUsers = useCallback(async (): Promise<ActionResult<Combined[]>> => {
    const regRes = isRegistrations
      ? await handleGetRegisteredUsersInActivity({ id: activityId }, slug)
      : await handleGetUsersWhoParticipateInActivity({ id: activityId }, slug);
    if (!regRes.success) {
      return { success: false, data: null, message: regRes.message || 'Falha inesperada' };
    }
    if(!regRes.data)
      return { success: true, data: [], message: 'Nenhum usuário encontrado' };

    const registrations: ActivityRegistrationI[] = regRes.data;
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
  }, [activityId, isRegistrations, slug]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);

    const res = await runWithToast(
      loadRegistrationsWithUsers(),
      {
        loading: 'Carregando usuários...',
        success: () => 'Usuários carregados',
        error: () => 'Erro ao carregar usuários',
      }
    );

    if (res.success && res.data) setUsersRegistrations(res.data);
    
    setLoading(false);
  }, [loadRegistrationsWithUsers]);
  
  useEffect(() => {
    if (open) {
      setUsersRegistrations([]);
      fetchUsers();
    }
  }, [open, fetchUsers]);

  return(
    <CustomGenericModal
      title={`${isRegistrations ? "Inscrições" : "Participações"} na Atividade: ${activityName}`}
      description={`Verifique os usuários que se ${isRegistrations ? "inscreveram na" : "participaram da"} atividade`}
      open={open}
      onOpenChange={setOpen}
      trigger={null}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>E-mail</TableHead>
            <TableHead>{isRegistrations ? "Se Registrou" : "Participou"} em</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? 
            <TableRow>
              <TableCell colSpan={3}><LoadingSpinner/></TableCell>
            </TableRow>
            : usersRegistrations.length === 0 ? 
              <TableRow>
                <TableCell colSpan={3}>
                  Nenhum usuário {isRegistrations ? "registrado" : "que participou"} encontrado
                </TableCell>
              </TableRow>  
            : usersRegistrations.map((u) => (
              <TableRow key={u.user_id}>
                <TableCell>{u.Name} {u.LastName}</TableCell>
                <TableCell>{u.Email}</TableCell>
                <TableCell>
                  {isRegistrations 
                    ? formatFullDate(u.registered_at) 
                    : formatFullDate(u.attended_at || new Date().toString())
                  }
                </TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    </CustomGenericModal>
  )
}

export default UserActivityInfoTable;