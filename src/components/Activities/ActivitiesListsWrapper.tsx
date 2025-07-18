"use client";
import { useEffect, useState } from "react";
import ActivitiesUserListSection from "./ActivitiesUserListSection";
import ActivitiesGeneralListSection from "./ActivitiesGeneralListSection";
import { ActivityResponseI } from "@/types/activity-interface";
import { 
  handleGetUserEventActivities, 
  handleGetAllEventActivities, 
  handleUnregisterFromActivity, 
  handleRegisterFromActivity 
} from "@/actions/activity-actions";
import { UserAccessTokenJwtPayload } from "@/types/auth-interfaces";

interface ActivitiesListsWrapperProps {
  slug: string;
  user_info: UserAccessTokenJwtPayload
}

export default function ActivitiesListsWrapper({ slug, user_info }: ActivitiesListsWrapperProps) {
  const [userActivities, setUserActivities] = useState<ActivityResponseI[]>([]);
  const [generalActivities, setGeneralActivities] = useState<ActivityResponseI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      const [userRes, generalRes] = await Promise.all([
        handleGetUserEventActivities(slug),
        handleGetAllEventActivities(slug)
      ]);
      if (userRes.success) setUserActivities(userRes.data ?? []);
      if (generalRes.success) setGeneralActivities(generalRes.data ?? []);
      setLoading(false);
    };
    fetchAll();
  }, [slug]);

  const handleSubscribe = async (activity: ActivityResponseI) => {
    const result = await handleRegisterFromActivity(activity, slug, user_info.id);
    if(result.success) {
      setUserActivities(prev => [...prev, activity]);
      setGeneralActivities(prev => prev.filter(a => a.ID !== activity.ID));
    }
  };

  const handleUnsubscribe = async (activity: ActivityResponseI) => {
    const result = await handleUnregisterFromActivity(activity, slug, user_info.id);
    if(result.success) {
      setGeneralActivities(prev => [...prev, activity]);
      setUserActivities(prev => prev.filter(a => a.ID !== activity.ID));
    }
    
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <>
      <h1 className="text-accent text-3xl">Atividades do usuário</h1>
      <ActivitiesUserListSection
        slug={slug}
        activities={userActivities}
        onUnsubscribe={handleUnsubscribe}
      />
      <h1 className="text-accent text-3xl">Atividades gerais</h1>
      <ActivitiesGeneralListSection
        slug={slug}
        activities={generalActivities}
        onSubscribe={handleSubscribe}
      />
    </>
  );
} 