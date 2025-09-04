import { useCallback, useState } from "react";
import { useEffect } from "react";
import ResultOverlay from "../ResultOverlay";
import type { ActivityRegistrationI } from "@/types/activity-interface";
import type { UserBasicInfo } from "@/types/auth-interfaces";
import { handleGetUsersWhoParticipateInActivity, handleMarkActivityUserWinner } from "@/actions/activity-actions";
import type { ActionResult } from "@/actions/_utils";
import { handleGetUsersInfo } from "@/actions/user-actions";
import { getRandomIndex } from "@/lib/utils";
import NameRoller from "./NameRoller";
import LoadingSpinner from "../Loading/LoadingSpinner";

interface Props {
  activityId: string;
  slug: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Combined = UserBasicInfo & ActivityRegistrationI;

export default function UserActivityPrizeDraw({ activityId, slug, open, onOpenChange }: Props) {
  const [loading, setLoading] = useState(true);
  const [usersRegistrations, setUsersRegistrations] = useState<Combined[]>([]);
  const [winner, setWinner] = useState<Combined | null>(null);

  const loadRegistrationsWithUsers = useCallback(async (): Promise<ActionResult<Combined[]>> => {
    const regRes = await handleGetUsersWhoParticipateInActivity({ id: activityId }, slug);
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
  }, [activityId, slug]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);

    const res = await loadRegistrationsWithUsers();
    if (res.success && res.data) {
      setUsersRegistrations(res.data);
      const winner = res.data[getRandomIndex(res.data.length)];
      setWinner(winner);
      handleMarkActivityUserWinner(
        {id: activityId, name: `${winner.Name} ${winner.LastName ?? winner.last_name}`},
        slug
      )
    }
    
    setLoading(false);
  }, [activityId, loadRegistrationsWithUsers, slug]);
  
  useEffect(() => {
    if (open) {
      setUsersRegistrations([]);
      fetchUsers();
    }
  }, [open, fetchUsers]);

  if (loading) return (
    <ResultOverlay
      open={open}
      onOpenChange={onOpenChange}
    >
      <LoadingSpinner size="xl"/>
    </ResultOverlay>
  ) 

  return (
    <ResultOverlay
      open={open}
      onOpenChange={onOpenChange}
    >
      <NameRoller
        users={usersRegistrations}
        winner={winner}
        minCount={120}
        durationSec={18}
        onExit={() => onOpenChange(false)}
        onReplay={async () => {
          setUsersRegistrations([]);
          await fetchUsers();
        }}
      />
    </ResultOverlay>
  )
}