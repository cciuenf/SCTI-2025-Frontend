import InfoCarousel from "@/components/Home/InfoCarousel";
import Connector from "@/components/ui/Generic/Connector";
import { handleGetAllEventActivities } from "@/actions/activity-actions";
import ActivityCard from "@/components/Activities/ActivityCard";
import AutoScrollSponsors from "@/components/Home/AutoScrollSponsors";
import ScrollManager from "@/components/ScrollManager";
import { handleGetAllPurchasedProducts } from "@/actions/product-actions";
import { handleGetUsersInfo } from "@/actions/user-actions";
import type { UserBasicInfo } from "@/types/auth-interfaces";
import type { UserProductPurchasesResponseI } from "@/types/product-interfaces";
import React from "react";

type Supporter = UserBasicInfo & UserProductPurchasesResponseI


export default async function HomePage() {
  async function getAllSupporter () {
    const resultProducts = await handleGetAllPurchasedProducts();
    const products = resultProducts.data || []
    const ids = products.map(item => item.user_id)
    const resultUsers = (await handleGetUsersInfo({ id_array: ids })).data || [];

    const combined = products.map((reg, idx) => ({
        ...reg,
        ...resultUsers[idx]
      }));
      const unified = Array.from(
        combined.reduce<Map<string, Supporter>>((map, curr) => {
          const key = `${curr.user_id}-${curr.product_id}`;
          if (map.has(key)) map.get(key)!.quantity += curr.quantity;
          else map.set(key, { ...curr });
          return map;
        }, new Map()).values()
      );
    return unified;
  };
  const resultActivities = (await handleGetAllEventActivities("scti")).data;
  // const allSupporters = (await getAllSupporter()).filter(
  //   item => item.product_id === process.env.SUPPORTER_PRODUCT_ID
  // );
  const allSupporters = [{
    name: "Niki",
    last_name: "Calveley"
  }, {
    name: "Dyane",
    last_name: "Cumbridge"
  }, {
    name: "Giles",
    last_name: "McGinnis"
  }, {
    name: "Marijn",
    last_name: "Grooby"
  }, {
    name: "Vlad",
    last_name: "Iacovucci"
  }, {
    name: "Ethelbert",
    last_name: "Quincey"
  }, {
    name: "Carleen",
    last_name: "McLelland"
  }, {
    name: "Meridel",
    last_name: "Bonar"
  }, {
    name: "Nicko",
    last_name: "Kleuer"
  }, {
    name: "Brod",
    last_name: "Picknett"
  }, {
    name: "Marabel",
    last_name: "Dobbson"
  }, {
    name: "Mindy",
    last_name: "Kenney"
  }, {
    name: "Harvey",
    last_name: "Rothery"
  }, {
    name: "Pierce",
    last_name: "Andell"
  }, {
    name: "Brena",
    last_name: "Digby"
  }, {
    name: "Bobette",
    last_name: "Kerrey"
  }, {
    name: "Ada",
    last_name: "Bensley"
  }, {
    name: "Elysee",
    last_name: "Howell"
  }, {
    name: "Lucas",
    last_name: "Mallinder"
  }, {
    name: "Jane",
    last_name: "Westwell"
  }, {
    name: "Bekki",
    last_name: "Duffit"
  }, {
    name: "Jilly",
    last_name: "Lugton"
  }, {
    name: "Shaina",
    last_name: "Ashborne"
  }, {
    name: "Willis",
    last_name: "Follen"
  }, {
    name: "Nan",
    last_name: "MacDuff"
  }, {
    name: "Maude",
    last_name: "Bannard"
  }, {
    name: "Eleanore",
    last_name: "Hallybone"
  }, {
    name: "Heinrick",
    last_name: "Pariss"
  }, {
    name: "Joseph",
    last_name: "Zarfati"
  }, {
    name: "Adam",
    last_name: "Prate"
  }, {
    name: "Annabell",
    last_name: "Simmon"
  }, {
    name: "Fedora",
    last_name: "Lemmens"
  }, {
    name: "Maurizio",
    last_name: "Thake"
  }, {
    name: "Missy",
    last_name: "Rushman"
  }, {
    name: "Audre",
    last_name: "Marfe"
  }, {
    name: "Skippy",
    last_name: "Kleinplac"
  }, {
    name: "Fred",
    last_name: "Upfold"
  }, {
    name: "Pacorro",
    last_name: "Cheeke"
  }, {
    name: "Fredek",
    last_name: "O'Longain"
  }, {
    name: "Francisca",
    last_name: "Sanbrook"
  }, {
    name: "Ansel",
    last_name: "McCulloch"
  }, {
    name: "Maryl",
    last_name: "Gerriet"
  }, {
    name: "Shandee",
    last_name: "Menham"
  }, {
    name: "Feliza",
    last_name: "Crumb"
  }, {
    name: "Ester",
    last_name: "Foker"
  }, {
    name: "Rhody",
    last_name: "de Guise"
  }, {
    name: "Talya",
    last_name: "Brotherhood"
  }, {
    name: "Krishnah",
    last_name: "Tunnock"
  }, {
    name: "Jemima",
    last_name: "Josse"
  }, {
    name: "Valery",
    last_name: "Hache"
  }, {
    name: "Geri",
    last_name: "McGilbon"
  }, {
    name: "Amaleta",
    last_name: "Tite"
  }, {
    name: "Tobi",
    last_name: "Herculeson"
  }, {
    name: "Jolene",
    last_name: "Anslow"
  }, {
    name: "Maurene",
    last_name: "Keelin"
  }, {
    name: "Cyndy",
    last_name: "Minillo"
  }, {
    name: "Ozzy",
    last_name: "Nesey"
  }, {
    name: "Doralyn",
    last_name: "Gibard"
  }, {
    name: "Theodore",
    last_name: "Costley"
  }, {
    name: "Gerrie",
    last_name: "Bafford"
  }, {
    name: "Annis",
    last_name: "Allnutt"
  }, {
    name: "Francoise",
    last_name: "Gristock"
  }, {
    name: "Vera",
    last_name: "Kitchinham"
  }, {
    name: "Che",
    last_name: "Croneen"
  }, {
    name: "Dore",
    last_name: "Florez"
  }, {
    name: "Itch",
    last_name: "Knowlson"
  }, {
    name: "Dyanne",
    last_name: "Bousquet"
  }, {
    name: "Lind",
    last_name: "Swadlin"
  }, {
    name: "Alyda",
    last_name: "Blazeby"
  }, {
    name: "Svend",
    last_name: "Jaffrey"
  }, {
    name: "Calida",
    last_name: "Colaton"
  }, {
    name: "Cariotta",
    last_name: "Beslier"
  }, {
    name: "Alphonso",
    last_name: "Eagles"
  }, {
    name: "Marleen",
    last_name: "Jeroch"
  }, {
    name: "Gabbie",
    last_name: "Tupling"
  }, {
    name: "Walliw",
    last_name: "Mawman"
  }, {
    name: "Dosi",
    last_name: "Souster"
  }, {
    name: "Peri",
    last_name: "Blasio"
  }, {
    name: "Lenna",
    last_name: "Tackell"
  }, {
    name: "Cori",
    last_name: "Gell"
  }, {
    name: "Deck",
    last_name: "Wyre"
  }, {
    name: "Aurora",
    last_name: "Austins"
  }, {
    name: "Orbadiah",
    last_name: "Gerge"
  }, {
    name: "Fredek",
    last_name: "Poulgreen"
  }, {
    name: "Nelly",
    last_name: "Abbey"
  }, {
    name: "Aimil",
    last_name: "Foxall"
  }, {
    name: "Arabel",
    last_name: "Fantini"
  }, {
    name: "Steven",
    last_name: "Carlon"
  }, {
    name: "Jewell",
    last_name: "Baldoni"
  }, {
    name: "Shaine",
    last_name: "Janowicz"
  }, {
    name: "Franchot",
    last_name: "Gulliver"
  }, {
    name: "Renae",
    last_name: "Lawry"
  }, {
    name: "Artemis",
    last_name: "Lockitt"
  }, {
    name: "Peg",
    last_name: "Borsnall"
  }]

  return (
    <div className="flex flex-col items-center font-spartan mx-auto">
      <ScrollManager />
      <InfoCarousel />
      <Connector id="info" className="text-center flex flex-col items-center w-screen !mt-20">
        <h2 className="text-4xl font-bold">Atividades da Semana</h2>
        <p className="text-md text-center font-light sm:w-1/2 px-4 mb-10">
          Descubra nossa programação completa com palestras, workshops e
          atividades práticas nas mais diversas áreas da ciência e tecnologia.
        </p>
        <div className="grid justify-center md:grid-cols-2 lg:grid-cols-3 sm:gap-10 gap-2 w-full px-32">
          {resultActivities && resultActivities.length > 0 ? (
            resultActivities.map((card) => (
              <ActivityCard
                key={card.activity.ID}
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
        <h2 className="text-4xl font-bold my-4">Nossos Apoiadores</h2>
        <div className="flex flex-wrap items-center justify-center gap-4 my-3 px-4">
          {allSupporters && allSupporters.length > 0 ? (
            allSupporters.map((prod, i) => (
              <React.Fragment key={i}>
                <p>{prod.name} {prod.last_name}</p>

              </React.Fragment>
            ))
          ): (
            <p className="col-span-full text-center text-gray-500">
              Nenhum apoiador.
            </p>
          )}
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
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d231.59193621020208!2d-41.29157224025164!3d-21.76202565086077!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xbdd59779f62349%3A0x13e700efb0c12ad3!2zQ2nDqm5jaWEgZGEgQ29tcHV0YcOnw6NvIFVFTkY!5e0!3m2!1spt-BR!2sbr!4v1756014700287!5m2!1spt-BR!2sbr"
          className="w-full min-h-screen h-full border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </Connector>
    </div>
  );
}
