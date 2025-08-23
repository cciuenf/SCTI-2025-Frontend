import InfoCarousel from "@/components/Home/InfoCarousel";
import Connector from "@/components/ui/Generic/Connector";
import { handleGetAllEventActivities } from "@/actions/activity-actions";
import ActivityCard from "@/components/Activities/ActivityCard";
import Sponsor from "@/components/Home/Sponsor";
import AutoScrollSponsors from "@/components/Home/AutoScrollSponsors";
import ScrollManager from "@/components/ScrollManager";


export default async function HomePage() {
  const result = await handleGetAllEventActivities("scti");
  return (
    <div className="flex flex-col items-center font-spartan mx-auto">
      <ScrollManager />
      <InfoCarousel />
      <Connector className="text-center flex flex-col items-center w-screen !mt-20">
        <h2 className="text-4xl font-bold">Atividades da Semana</h2>
        <p className="text-md text-center font-light sm:w-1/2 px-4 mb-10">
          Descubra nossa programação completa com palestras, workshops e
          atividades práticas nas mais diversas áreas da ciência e tecnologia.
        </p>
        <div className="grid justify-center md:grid-cols-2 lg:grid-cols-3 sm:gap-10 gap-2 w-full px-32">
          {result.data && result.data.length > 0 ? (
            result.data.map((card) => (
              <ActivityCard
                key={card.ID}
                data={card}
                isEventCreator={false}
                isSubscribed={false}
              />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              Nenhuma atividade disponível no momento.
            </p>
          )}
        </div>
      </Connector>
      <Connector className="text-center flex flex-col items-center w-screen !mt-20">
        <h2 className="text-4xl font-bold">Nossos Patrocinadores</h2>
        <p className="text-md text-center font-light sm:w-1/2 px-4 mb-10">
          Agradecemos imensamente às empresas que tornaram possível a realização
          do SCT 2025. Conheça os parceiros que acreditam no potencial dos
          estudantes universitários.
        </p>
        <div className="w-full overflow-auto">
          <AutoScrollSponsors
            scale="scale-[90%]"
            sponsors={[{ text: "Alura", imagePath: "alura-light.svg" }, {text: "Código de Ouro", imagePath: "/img/sponsors/codigoouro.png"}]}
          />
        </div>
      </Connector>
      <Connector className="text-center flex flex-col items-center w-screen h-screen !mt-20">
        <h2 className="text-4xl font-bold">Localização do Evento</h2>
        <p className="text-md text-center font-light sm:w-1/2 px-4 mb-10">
          A SCT 2025 acontece no campus da UENF, em Campos dos Goytacazes (RJ),
          onde serão realizados todos os workshops, palestras e exposições do
          evento.
        </p>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d463.1845209940032!2d-41.29240932163486!3d-21.761824678315794!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xbdd59aeac46b65%3A0x1b713a26d44d896a!2sUENF%20-%20CCT%20Centro%20de%20Ci%C3%AAncia%20e%20Tecnologia!5e0!3m2!1spt-BR!2sbr!4v1754446232724!5m2!1spt-BR!2sbr"
          className="w-full min-h-screen h-full border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </Connector>
      {/* <Connector className="text-center flex flex-col items-center w-screen h-screen !m-0">
        <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center  mt-20 text-center pointer-events-none">
          <h2 className="text-4xl font-bold">Localização do Evento</h2>
          <p className="text-md text-center font-light sm:w-1/2 px-4 mb-10">
            A SCT 2025 acontece no campus da UENF, em Campos dos Goytacazes (RJ),
            onde serão realizados todos os workshops, palestras e exposições do evento.
          </p>
        </div>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d463.1845209940032!2d-41.29240932163486!3d-21.761824678315794!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xbdd59aeac46b65%3A0x1b713a26d44d896a!2sUENF%20-%20CCT%20Centro%20de%20Ci%C3%AAncia%20e%20Tecnologia!5e0!3m2!1spt-BR!2sbr!4v1754446232724!5m2!1spt-BR!2sbr"
          className="w-full min-h-screen h-full border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </Connector> */}
      {/* </Connector> */}
    </div>
  );
}
