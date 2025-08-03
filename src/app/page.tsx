import InfoCarousel from "@/components/Home/InfoCarousel";
import Connector from "@/components/ui/Generic/Connector";
import { handleGetAllEventActivities } from "@/actions/activity-actions";
import ActivityCard from "@/components/Activities/ActivityCard";
import Sponsor from "@/components/Home/Sponsor";
import AutoScrollSponsors from "@/components/Home/AutoScrollSponsors";

export default async function HomePage() {
  const result = await handleGetAllEventActivities("scti");
  return (
    <div className="flex flex-col items-center font-spartan mx-auto">
      <InfoCarousel />
      <Connector className="text-center flex flex-col items-center !mt-20" id="info">
        <h2 className="text-4xl font-bold">Atividades da Semana</h2>
        <p className="text-md text-center font-light sm:w-1/2 px-4 mb-10">
          Descubra nossa programação completa com palestras, workshops e
          atividades práticas nas mais diversas áreas da ciência e tecnologia.
        </p>
        <div 
          className="grid justify-center md:grid-cols-2 lg:grid-cols-3 sm:gap-10 gap-2 w-full px-32" 
        >
          {result.data && result.data.length > 0 ? result.data.map(card => (
            <ActivityCard 
              key={card.ID}
              data={card}
              isEventCreator={false}
              isSubscribed={false}
            />
          )): (
            <p className="col-span-full text-center text-gray-500">
              Nenhuma atividade disponível no momento.
            </p>
          )}
        </div>
      </Connector>
      <Connector className="text-center flex flex-col items-center w-screen !mt-20">
        <h2 className="text-4xl font-bold">Nossos Patrocinadores</h2>
        <p className="text-md text-center font-light sm:w-1/2 px-4 mb-10">
          Agradecemos imensamente às empresas que tornaram possível a realização do SCT 2025.
          Conheça os parceiros que acreditam no potencial dos estudantes universitários.
        </p>
        <h3 className="text-2xl font-bold underline mb-4">Patrocinador Diamante</h3>
        <Sponsor scale="scale-[100%]"/>
        <h3 className="text-2xl font-bold underline mt-8 mb-2">Patrocinador Safira</h3>
        <div className="w-full overflow-auto">
          <AutoScrollSponsors />
        </div>
      </Connector>
    </div>
  );
}
