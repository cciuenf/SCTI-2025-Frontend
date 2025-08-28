// import ProfileTabs from "@/components/Profile/ProfileTabs";
// import ProfileInfos from "@/components/Profile/ProfileInfos";

import { cookies } from "next/headers";
import type {
  UserAccessTokenJwtPayload,
  UserRefreshTokenJwtPayload,
} from "@/types/auth-interfaces";
import jwt from "jsonwebtoken";
import { handleGetUserDeviceInfos } from "@/actions/auth-actions";
import CustomGenericTabs, { type TabItem } from "@/components/ui/Generic/CustomGenericTabs";
import ProfileInfo from "@/components/Profile/Tabs/ProfileInfo";
import { ProfileUserProducts } from "@/components/Profile/Tabs/ProfileUserProducts";
import UserPurchases from "@/components/UserPurchases";
import UserLogins from "@/components/Profile/Tabs/UserLogins";

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
  const device_info = await handleGetUserDeviceInfos();

  const tabs: TabItem[] = [
    {
      id: "infos",
      label: "Informações",
      content: (
        <ProfileInfo 
          user_access_info={user_access_info} 
          user_refresh_info={user_refresh_info} 
          device_info={device_info}
        />
      ),
    },
    {
      id: "products",
      label: "Produtos",
      content: <ProfileUserProducts />
    },
    {
      id: "shopping",
      label: "Compras",
      content: <UserPurchases />
    },
    {
      id: "security",
      label: "Segurança",
      content: <UserLogins refresh_token={refresh_token || ""} />
    },
  ]

  return (
    <div className="flex flex-col items-center max-h-screen w-full overflow-hidden">
      <CustomGenericTabs
        tabs={tabs}
        initialTabId={view}
        className="max-w-7xl"
      />
    </div>
  );
};

export default ProfilePage;
