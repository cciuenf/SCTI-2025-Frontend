import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { UserAccessTokenJwtPayload } from "@/types/auth-interfaces";
import TopCard from "@/components/Dashboard/TopCard";
import ProductsDashboardCard from "@/components/Dashboard/ProductsDashboardCard";
import ActivitiesDashboardCard from "@/components/Dashboard/ActivitiesDashboardCard";

export default async function Dashboard() {
  const cookieStore = cookies();
  const access_token = (await cookieStore).get("access_token")?.value;
  const user_info = jwt.decode(
    access_token as string
  ) as UserAccessTokenJwtPayload | null;
  const refresh_token = (await cookieStore).get("refresh_token")?.value;

  return (
    <div className="w-full flex flex-col items-center font-spartan gap-5 py-15">
      <div className="flex flex-col justify-around items-center">
        <h1 className="font-bold text-6xl">Minha SCTI</h1>
        <h2 className="font-light text-2xl">
          Veja um resumo da sua semana acadêmica!
        </h2>
      </div>
      <div className="w-7/10 flex justify-around items-center">
        <TopCard data={user_info} />
        <TopCard data={user_info} />
        <TopCard data={user_info} />
      </div>
      <div className="w-7/10 flex justify-around items-center">
        <ActivitiesDashboardCard />
        <ProductsDashboardCard />
      </div>
    </div>
  );
}
