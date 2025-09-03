import { useCallback, useState } from "react";
import { useEffect } from "react";
import ResultOverlay from "../ResultOverlay";
import type { ActivityRegistrationI } from "@/types/activity-interface";
import type { UserBasicInfo } from "@/types/auth-interfaces";
import { handleGetUsersWhoParticipateInActivity } from "@/actions/activity-actions";
import type { ActionResult } from "@/actions/_utils";
import { handleGetUsersInfo } from "@/actions/user-actions";
import { runWithToast } from "@/lib/client/run-with-toast";
import { getRandomIndex } from "@/lib/utils";


interface Props {
  activityId: string;
  slug: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Combined = UserBasicInfo & ActivityRegistrationI;


export default function UserActivityPrizeDraw({ activityId, slug, open, onOpenChange }: Props) {
  const [usersRegistrations, setUsersRegistrations] = useState<Combined[]>([]);
  const [loading, setLoading] = useState(true);
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

    // TODO: Mostrar todos os usuários antes de mostrar o vencedor na animação. Demorar tipo 0.1s por usuário e increementaando para cada até chegar no últimp
    // o nome do usuário começa pequeno centro e cresce até desaparecer e nisso vem o próximo.

    return { success: true, data: combined, message: 'Usuários carregados' };
  }, [activityId, slug]);

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
    if (res.success && res.data) {
      setUsersRegistrations(res.data);
      setWinner(res.data[getRandomIndex(res.data.length)]);
    }
    
    setLoading(false);
  }, [loadRegistrationsWithUsers]);
  
  useEffect(() => {
    if (open) {
      setUsersRegistrations([]);
      fetchUsers();
    }
  }, [open, fetchUsers]);

  return (
    <ResultOverlay
      open={open}
      onOpenChange={onOpenChange}
      approved={true}
    >
      <div>
        {/* <h1>Sorteio realizado com sucesso</h1> */}
        {/* <p>O sorteio foi realizado com sucesso</p> */}
      </div>
    </ResultOverlay>
  )
}