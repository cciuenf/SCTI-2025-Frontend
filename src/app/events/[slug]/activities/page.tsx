import ActivitiesListsWrapper from "@/components/Activities/ActivitiesListsWrapper";
import { getUserInfo } from "@/lib/cookies";

interface ActivitiesPageProps {
  params: {
    slug: string;
  };
}

export default async function EventActivitiesPage({ params }: ActivitiesPageProps) {
  const { slug } = await params;
  const user_info = await getUserInfo();
  return (
    <div className="flex flex-col w-4/5 mx-auto items-center justify-center gap-10 mt-10">
      {user_info && <ActivitiesListsWrapper slug={slug} user_info={user_info} />}
    </div>
  );
}