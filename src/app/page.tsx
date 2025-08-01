import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import InfoCarousel from "@/components/Home/InfoCarousel";
import Connector from "@/components/ui/Generic/Connector";
import { handleGetAllEventActivities } from "@/actions/activity-actions";
import ActivityCard from "@/components/Activities/ActivityCard";

export default async function HomePage() {
  const result = await handleGetAllEventActivities("scti");
  return (
    <div className="flex flex-col items-center font-spartan mx-auto">
      <InfoCarousel />
      <Connector className="text-center flex flex-col items-center" id="info">
        <h2 className="text-6xl font-bold">Atividades da Semana</h2>
        <h3 className="text-md text-center font-light sm:w-1/2 px-4 mb-10">
          Descubra nossa programação completa com palestras, workshops e
          atividades práticas nas mais diversas áreas da ciência e tecnologia.
        </h3>
        <div 
          className="grid justify-center md:grid-cols-2 lg:grid-cols-3 sm:gap-10 gap-2 w-full px-32" 
        >
          {result.data.map(card => (
            <ActivityCard 
              key={card.ID}
              data={card}
              isEventCreator={false}
              isSubscribed={false}
            />
          ))}
        </div>
      </Connector>
      <Connector>
        <h2 className="text-6xl font-bold">
          <span className="text-accent border-b-4 border-secondary">
            SCT
          </span>
          2025
        </h2>
        <div className="w-3/4 flex items-center justify-around flex-wrap md:w-full pb-6">
          <Image
            src={"/test.jpg"}
            width={250}
            height={200}
            alt=""
            className="rounded-md"
          />
          <div className="w-1/2 flex flex-col items-center justify-around">
            <h3 className="text-md font-light">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
              mollis aliquet pellentesque. Nunc elementum, nulla et suscipit
              tincidunt, nisi ante pharetra eros, non tincidunt ante lorem eget
              lacus. Quisque consectetur dignissim nisi id bibendum. Aliquam
              auctor nisl a orci semper, ac sagittis ex iaculis. Nam condimentum
              justo ut molestie gravida. Aliquam metus lectus, dictum vehicula
              sodales sed, semper ac nisl. Donec id erat a est varius ultrices
              suscipit vel leo. Vivamus vitae congue elit. Pellentesque mollis,
              elit eget hendrerit efficitur, elit ipsum pretium risus, sit amet
              congue urna ligula non lorem. Donec et volutpat nisl, in egestas
              nibh. Cras ullamcorper, metus et lacinia tincidunt, arcu ex volutpat
              nulla, eu sodales justo velit at mi. Mauris sollicitudin nisi arcu,
              ac aliquam lacus sollicitudin venenatis.
            </h3>
            <Button asChild>
              <Link href={"login"}>Conheça nossa equipe</Link>
            </Button>
          </div>
        </div>
      </Connector>
      {/* <Connector /> */}
    </div>
  );
}
