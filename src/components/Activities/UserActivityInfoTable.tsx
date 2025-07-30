import { useEffect, useState } from "react";
import CustomGenericModal from "../ui/Generic/CustomGenericModal"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { toast } from "sonner";
import LoadingSpinner from "../Loading/LoadingSpinner";
import { UserBasicInfo } from "@/types/auth-interfaces";
import { handleGetRegisteredUsersInActivity, handleGetUsersWhoParticipateInActivity } from "@/actions/activity-actions";
import { ActivityRegistrationI } from "@/types/activity-interface";
import { handleGetUsersInfo } from "@/actions/user-actions";
import { formatFullDate } from "@/lib/utils";

interface Props {
  activityId: string;
  activityName: string;
  slug: string;
  isRegistrations: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const UserActivityInfoTable = ({ activityId, activityName, slug, isRegistrations, open, setOpen }: Props) => {
  const [usersRegistrations, setUsersRegistrations] = useState<(UserBasicInfo & ActivityRegistrationI)[]>([])
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      let result;
      if(isRegistrations) result = await handleGetRegisteredUsersInActivity({ id: activityId }, slug);
      else result = await handleGetUsersWhoParticipateInActivity({ id: activityId }, slug);
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
    }
  }

  useEffect(() => {
    if(open) {
      setUsersRegistrations([]);
      fetchUsers();
    }
  }, [activityName, open])
  

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
                  {isRegistrations ? formatFullDate(u.registered_at) : formatFullDate(u.attended_at)}
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