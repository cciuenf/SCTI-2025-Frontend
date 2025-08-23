import ProfileTabs from "@/components/Profile/ProfileTabs";
import ProfileInfos from "@/components/Profile/ProfileInfos";

import { cookies } from "next/headers";
import type {
  UserAccessTokenJwtPayload,
  UserRefreshTokenJwtPayload,
} from "@/types/auth-interfaces";
import jwt from "jsonwebtoken";
import { handleGetUserDeviceInfos } from "@/actions/auth-actions";
import Connector from "@/components/ui/Generic/Connector";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
};

const ProfilePage = async ({ searchParams }: Props) => {
  const view = (await searchParams).view as string || "infos";

  const cookieStore = cookies();
  const access_token = (await cookieStore).get("access_token")?.value;
  const user_access_info = jwt.decode(
    access_token as string
  ) as UserAccessTokenJwtPayload | null;
  const refresh_token = (await cookieStore).get("refresh_token")?.value;
  const user_refresh_info = jwt.decode(
    refresh_token as string
  ) as UserRefreshTokenJwtPayload | null;
  const deviceInfos = await handleGetUserDeviceInfos();

  return (
    <Connector
      className="text-center flex flex-col items-center !mt-20"
      id="info"
    >
      <div className="w-full flex flex-col gap-15 items-center py-10">
        <ProfileTabs />
        <ProfileInfos
          user_access_info={user_access_info}
          user_refresh_info={user_refresh_info}
          refresh_token={refresh_token || ""}
          currentView={view}
          deviceInfos={deviceInfos.data}
        />
      </div>
    </Connector>
  );
};

export default ProfilePage;
