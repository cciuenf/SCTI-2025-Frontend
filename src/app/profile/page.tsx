import VerifyForm from "@/components/VerifyForm";
import ProfileBar from "@/components/Profile/ProfileBar";
import ProfileInfos from "@/components/Profile/ProfileInfos";

import { cookies } from "next/headers";
import { UserAccessTokenJwtPayload, UserRefreshTokenJwtPayload } from "@/types/auth-interfaces";
import jwt from "jsonwebtoken";

type Props = {
  searchParams: { view: string };
};

const page = async ({ searchParams }: Props) => {
  const params = await searchParams;

  const cookieStore = cookies();
  const access_token = (await cookieStore).get("access_token")?.value;
  const user_access_info = jwt.decode(
    access_token as string
  ) as UserAccessTokenJwtPayload | null;
  const refresh_token = (await cookieStore).get("refresh_token")?.value;
  const user_refresh_info = jwt.decode(refresh_token as string) as UserRefreshTokenJwtPayload | null


  return (
    <div className="flex flex-col gap-15 items-center mt-5">
      <ProfileBar />
      <ProfileInfos user_access_info={user_access_info} user_refresh_info={ user_refresh_info} currentView={params.view} />
    </div>
  );
};

export default page;
