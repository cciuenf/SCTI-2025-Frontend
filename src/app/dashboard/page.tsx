import DashBoardTopLayer from "@/components/Dashboard/DashboardTopLayer";
import NearActivitiesListCard from "@/components/Dashboard/NearActivitiesListCard";
import ActivitiesDashboardCard from "@/components/Dashboard/ActivitiesDashboardCard";
import Connector from "@/components/ui/Generic/Connector";

export default async function DashboardPage() {
  return (
    <>
      <Connector
        className="text-center flex flex-col items-center !mt-20"
        id="info"
      >
        <div className="w-full max-w-6xl flex flex-col items-center font-spartan gap-5">
          <h1 className="font-bold text-6xl">Minha SCTI</h1>
          <h2 className="font-light text-2xl text-center">
            Veja um resumo da sua semana acadêmica!
          </h2>
          <DashBoardTopLayer />
        </div>
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 p-4 gap-3">
          <ActivitiesDashboardCard />
          <NearActivitiesListCard />
        </div>
      </Connector>
    </>
  );
}
