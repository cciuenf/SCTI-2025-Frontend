import VerifyForm from "@/components/VerifyForm";
import ProfileBar from "@/components/Profile/ProfileBar";
import ProfileInfos from "@/components/Profile/ProfileInfos";

type Props = {
  searchParams: {view: string}
};

const page = async ({searchParams}: Props) => {
  const params = await searchParams

  return (
    <div className="flex flex-col gap-15 items-center mt-5">
      <ProfileBar />
      <ProfileInfos currentView={params.view}/>
    </div>
  );
};

export default page;
