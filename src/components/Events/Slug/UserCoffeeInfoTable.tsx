import type { ActionResult } from "@/actions/_utils";
import { handleGetUsersInfo } from "@/actions/user-actions";
import LoadingSpinner from "@/components/Loading/LoadingSpinner";
import CustomGenericModal from "@/components/ui/Generic/CustomGenericModal";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { runWithToast } from "@/lib/client/run-with-toast";
import { formatFullDate, safeTime } from "@/lib/date-utils";
import type { UserBasicInfo } from "@/types/auth-interfaces";
import type { EventCoffeeRegistrationsI } from "@/types/event-interfaces";
import { useCallback, useEffect, useState } from "react";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  registrations: EventCoffeeRegistrationsI[]
}

type Combined = UserBasicInfo & EventCoffeeRegistrationsI;

const UserCoffeeInfoTable = ({ 
  open,
  setOpen,
  registrations
}: Props) => {
  const [usersRegistrations, setUsersRegistrations] = useState<Combined[]>([])
  const [isLoading, setIsLoading] = useState(true);

  const loadRegistrationsWithUsers = useCallback(async (): Promise<ActionResult<Combined[]>> => {
    const ids = registrations.map(r => r.user_id);
    const usersRes = await handleGetUsersInfo({ id_array: ids });
    if (!usersRes.success || !usersRes.data) 
      return { success: false, data: null, message: usersRes.message ?? 'Falha ao ler usuários' };

    const users = usersRes.data;
    const combined = registrations.map((reg, idx) => ({
      ...reg,
      ...users[idx]
    }));

    const sortedData = [...combined].sort((a, b) => {
      const dateA = safeTime(a.attended_at || "");
      const dateB = safeTime(b.attended_at || "")
      return dateA - dateB;
    });

    return { success: true, data: sortedData, message: 'Usuários carregados' };

  }, [registrations]);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);

    const res = await runWithToast(
      loadRegistrationsWithUsers(),
      {
        loading: 'Carregando usuários...',
        success: () => 'Usuários carregados',
        error: () => 'Erro ao carregar usuários',
      }
    );

    if (res.success && res.data) setUsersRegistrations(res.data);
    
    setIsLoading(false);
  }, [loadRegistrationsWithUsers]);

  useEffect(() => {
    if (open) {
      setUsersRegistrations([]);
      fetchUsers();
    }
  }, [open, fetchUsers]);

  return(
    <CustomGenericModal
      title="Participantes do Coffee"
      description="Verifique os usuários que participaram do Coffee"
      open={open}
      onOpenChange={setOpen}
      trigger={undefined}
    >
      <Table className="h-full">
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>E-mail</TableHead>
            <TableHead>UENF?</TableHead>
            <TableHead>Participou em</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? 
            <TableRow>
              <TableCell colSpan={4}><LoadingSpinner/></TableCell>
            </TableRow>
            : usersRegistrations.length === 0 ? 
              <TableRow>
                <TableCell colSpan={4}>
                  Nenhum usuário encontrado
                </TableCell>
              </TableRow>  
            : usersRegistrations.map((u) => (
              <TableRow key={u.user_id}>
                <TableCell>{u.Name} {u.last_name}</TableCell>
                <TableCell>{u.Email}</TableCell>
                <TableCell>{u.is_uenf ? `${u.uenf_semester}º Semestre` : "-"}</TableCell>
                <TableCell>
                  {formatFullDate(u.attended_at || new Date().toString())}
                </TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    </CustomGenericModal>
  )
}

export default UserCoffeeInfoTable;