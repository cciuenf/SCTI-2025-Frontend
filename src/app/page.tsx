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

type Supporter = UserBasicInfo & UserProductPurchasesResponseI;

export default async function HomePage() {
  async function getAllSupporter() {
    const resultProducts = await handleGetAllPurchasedProducts();
    const products = resultProducts.data || [];
    const ids = products.map((item) => item.user_id);
    const resultUsers =
      (await handleGetUsersInfo({ id_array: ids })).data || [];

    const combined = products.map((reg, idx) => ({
      ...reg,
      ...resultUsers[idx],
    }));
    const unified = Array.from(
      combined
        .reduce<Map<string, Supporter>>((map, curr) => {
          const key = `${curr.user_id}-${curr.product_id}`;
          if (map.has(key)) map.get(key)!.quantity += curr.quantity;
          else map.set(key, { ...curr });
          return map;
        }, new Map())
        .values()
    );
    return unified;
  }
  const resultActivities = (await handleGetAllEventActivities("scti")).data;
  // const allSupporters = (await getAllSupporter()).filter(
  //   item => item.product_id === process.env.SUPPORTER_PRODUCT_ID
  // );
  const allSupporters = [
    {
      name: "Niki",
      last_name: "Calveley",
      quantity: 10,
    },
    {
      name: "Dyane",
      last_name: "Cumbridge",
      quantity: 10,
    },
    {
      name: "Giles",
      last_name: "McGinnis",
      quantity: 10,
    },
    {
      name: "Marijn",
      last_name: "Grooby",
      quantity: 10,
    },
    {
      name: "Vlad",
      last_name: "Iacovucci",
      quantity: 10,
    },
    {
      name: "Ethelbert",
      last_name: "Quincey",
      quantity: 10,
    },
    {
      name: "Carleen",
      last_name: "McLelland",
      quantity: 10,
    },
    {
      name: "Meridel",
      last_name: "Bonar",
      quantity: 10,
    },
    {
      name: "Nicko",
      last_name: "Kleuer",
      quantity: 10,
    },
    {
      name: "Brod",
      last_name: "Picknett",
      quantity: 10,
    },
    {
      name: "Marabel",
      last_name: "Dobbson",
      quantity: 10,
    },
    {
      name: "Mindy",
      last_name: "Kenney",
      quantity: 10,
    },
    {
      name: "Harvey",
      last_name: "Rothery",
      quantity: 10,
    },
    {
      name: "Pierce",
      last_name: "Andell",
      quantity: 10,
    },
    {
      name: "Brena",
      last_name: "Digby",
      quantity: 10,
    },
    {
      name: "Bobette",
      last_name: "Kerrey",
      quantity: 10,
    },
    {
      name: "Ada",
      last_name: "Bensley",
      quantity: 10,
    },
    {
      name: "Elysee",
      last_name: "Howell",
      quantity: 10,
    },
    {
      name: "Lucas",
      last_name: "Mallinder",
      quantity: 10,
    },
    {
      name: "Jane",
      last_name: "Westwell",
      quantity: 10,
    },
    {
      name: "Bekki",
      last_name: "Duffit",
      quantity: 10,
    },
    {
      name: "Jilly",
      last_name: "Lugton",
      quantity: 10,
    },
    {
      name: "Shaina",
      last_name: "Ashborne",
      quantity: 10,
    },
    {
      name: "Willis",
      last_name: "Follen",
      quantity: 10,
    },
    {
      name: "Nan",
      last_name: "MacDuff",
      quantity: 10,
    },
    {
      name: "Maude",
      last_name: "Bannard",
      quantity: 10,
    },
    {
      name: "Eleanore",
      last_name: "Hallybone",
      quantity: 10,
    },
    {
      name: "Heinrick",
      last_name: "Pariss",
      quantity: 10,
    },
    {
      name: "Joseph",
      last_name: "Zarfati",
      quantity: 10,
    },
    {
      name: "Adam",
      last_name: "Prate",
      quantity: 10,
    },
    {
      name: "Annabell",
      last_name: "Simmon",
      quantity: 10,
    },
    {
      name: "Fedora",
      last_name: "Lemmens",
      quantity: 10,
    },
    {
      name: "Maurizio",
      last_name: "Thake",
      quantity: 10,
    },
    {
      name: "Missy",
      last_name: "Rushman",
      quantity: 10,
    },
    {
      name: "Audre",
      last_name: "Marfe",
      quantity: 10,
    },
    {
      name: "Skippy",
      last_name: "Kleinplac",
      quantity: 10,
    },
    {
      name: "Fred",
      last_name: "Upfold",
      quantity: 10,
    },
    {
      name: "Pacorro",
      last_name: "Cheeke",
      quantity: 10,
    },
    {
      name: "Fredek",
      last_name: "O'Longain",
      quantity: 10,
    },
    {
      name: "Francisca",
      last_name: "Sanbrook",
      quantity: 10,
    },
    {
      name: "Ansel",
      last_name: "McCulloch",
      quantity: 10,
    },
    {
      name: "Maryl",
      last_name: "Gerriet",
      quantity: 10,
    },
    {
      name: "Shandee",
      last_name: "Menham",
      quantity: 10,
    },
    {
      name: "Feliza",
      last_name: "Crumb",
      quantity: 10,
    },
    {
      name: "Ester",
      last_name: "Foker",
      quantity: 10,
    },
    {
      name: "Rhody",
      last_name: "de Guise",
      quantity: 10,
    },
    {
      name: "Talya",
      last_name: "Brotherhood",
      quantity: 10,
    },
    {
      name: "Krishnah",
      last_name: "Tunnock",
      quantity: 10,
    },
    {
      name: "Jemima",
      last_name: "Josse",
      quantity: 10,
    },
    {
      name: "Valery",
      last_name: "Hache",
      quantity: 10,
    },
    {
      name: "Geri",
      last_name: "McGilbon",
      quantity: 10,
    },
    {
      name: "Amaleta",
      last_name: "Tite",
      quantity: 10,
    },
    {
      name: "Tobi",
      last_name: "Herculeson",
      quantity: 10,
    },
    {
      name: "Jolene",
      last_name: "Anslow",
      quantity: 10,
    },
    {
      name: "Maurene",
      last_name: "Keelin",
      quantity: 10,
    },
    {
      name: "Cyndy",
      last_name: "Minillo",
      quantity: 10,
    },
    {
      name: "Ozzy",
      last_name: "Nesey",
      quantity: 10,
    },
    {
      name: "Doralyn",
      last_name: "Gibard",
      quantity: 10,
    },
    {
      name: "Theodore",
      last_name: "Costley",
      quantity: 10,
    },
    {
      name: "Gerrie",
      last_name: "Bafford",
      quantity: 10,
    },
    {
      name: "Annis",
      last_name: "Allnutt",
      quantity: 10,
    },
    {
      name: "Francoise",
      last_name: "Gristock",
      quantity: 10,
    },
    {
      name: "Vera",
      last_name: "Kitchinham",
      quantity: 10,
    },
    {
      name: "Che",
      last_name: "Croneen",
      quantity: 10,
    },
    {
      name: "Dore",
      last_name: "Florez",
      quantity: 10,
    },
    {
      name: "Itch",
      last_name: "Knowlson",
      quantity: 10,
    },
    {
      name: "Dyanne",
      last_name: "Bousquet",
      quantity: 10,
    },
    {
      name: "Lind",
      last_name: "Swadlin",
      quantity: 10,
    },
    {
      name: "Alyda",
      last_name: "Blazeby",
      quantity: 10,
    },
    {
      name: "Svend",
      last_name: "Jaffrey",
      quantity: 10,
    },
    {
      name: "Calida",
      last_name: "Colaton",
      quantity: 10,
    },
    {
      name: "Cariotta",
      last_name: "Beslier",
      quantity: 10,
    },
    {
      name: "Alphonso",
      last_name: "Eagles",
      quantity: 10,
    },
    {
      name: "Marleen",
      last_name: "Jeroch",
      quantity: 10,
    },
    {
      name: "Gabbie",
      last_name: "Tupling",
      quantity: 10,
    },
    {
      name: "Walliw",
      last_name: "Mawman",
      quantity: 10,
    },
    {
      name: "Dosi",
      last_name: "Souster",
      quantity: 10,
    },
    {
      name: "Peri",
      last_name: "Blasio",
      quantity: 10,
    },
    {
      name: "Lenna",
      last_name: "Tackell",
      quantity: 10,
    },
    {
      name: "Cori",
      last_name: "Gell",
      quantity: 10,
    },
    {
      name: "Deck",
      last_name: "Wyre",
      quantity: 10,
    },
    {
      name: "Aurora",
      last_name: "Austins",
      quantity: 10,
    },
    {
      name: "Orbadiah",
      last_name: "Gerge",
      quantity: 10,
    },
    {
      name: "Fredek",
      last_name: "Poulgreen",
      quantity: 10,
    },
    {
      name: "Nelly",
      last_name: "Abbey",
      quantity: 10,
    },
    {
      name: "Aimil",
      last_name: "Foxall",
      quantity: 10,
    },
    {
      name: "Arabel",
      last_name: "Fantini",
      quantity: 10,
    },
    {
      name: "Steven",
      last_name: "Carlon",
      quantity: 10,
    },
    {
      name: "Jewell",
      last_name: "Baldoni",
      quantity: 10,
    },
    {
      name: "Shaine",
      last_name: "Janowicz",
      quantity: 10,
    },
    {
      name: "Franchot",
      last_name: "Gulliver",
      quantity: 10,
    },
    {
      name: "Renae",
      last_name: "Lawry",
      quantity: 10,
    },
    {
      name: "Artemis",
      last_name: "Lockitt",
      quantity: 10,
    },
    {
      name: "Peg",
      last_name: "Borsnall",
      quantity: 10,
    },
  ];

  return (
    <div className="flex flex-col items-center font-spartan mx-auto">
      <ScrollManager />
      <InfoCarousel />
      <Connector
        id="info"
        className="text-center flex flex-col items-center w-screen !mt-20"
      >
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
          do SCTI 2025. Conheça os parceiros que acreditam no potencial dos
          estudantes universitários.
        </p>
        <div className="w-full overflow-auto">
          <AutoScrollSponsors
            scale="scale-[90%]"
            sponsors={[
              { text: "Alura", imagePath: "alura-light.svg" },
              {
                text: "Código de Ouro",
                imagePath: "/img/sponsors/codigoouro.png",
              },
            ]}
          />
        </div>
        <div className="flex items-center md:gap-5 lg:gap-10">
          <span className="opacity-0 md:opacity-100 md:w-52 lg:w-72 h-0.5 bg-linear-to-bl to-zinc-100 from-secondary"></span>
          <h2 className="text-4xl font-bold my-4">Nossos Apoiadores</h2>
          <span className="opacity-0 md:opacity-100 md:w-52 lg:w-72 h-0.5 bg-linear-to-br to-zinc-100 from-secondary"></span>
        </div>
        <p className="text-md text-center font-light sm:w-1/2 px-4 mb-10">
          Expressamos profunda gratidão a todos que contribuíram com o evento
          por meio de doações voluntárias. Ficamos felizes em tocar seus
          corações com o nosso propósito.
        </p>
        <div className="flex flex-wrap items-center justify-center max-w-7xl gap-4 my-3 px-4">
          {allSupporters && allSupporters.length > 0 ? (
            allSupporters.map((prod, i) => (
              <React.Fragment key={i}>
                <p>{`${prod.name} ${prod.last_name}`}</p>
              </React.Fragment>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              Nenhum apoiador.
            </p>
          )}
        </div>
      </Connector>
      <Connector className="text-center flex flex-col items-center w-screen h-screen !mt-20">
        <h2 className="text-4xl font-bold">Localização do Evento</h2>
        <p className="text-md text-center font-light sm:w-1/2 px-4 mb-10">
          A SCTI 2025 acontece no campus da UENF, em Campos dos Goytacazes (RJ),
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
