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
import { cn } from "@/lib/utils";
import { safeTime } from "@/lib/date-utils";

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
  resultActivities?.sort(
    (a, b) => safeTime(a.activity.start_time) - safeTime(b.activity.start_time)
  );
  const allSupporters = (await getAllSupporter()).filter(
    item => item.product_id === process.env.SUPPORTER_PRODUCT_ID
  );

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
        <div className={cn(
          "grid justify-center md:grid-cols-2 lg:grid-cols-3 sm:gap-10 gap-2 w-full px-32",
          "max-w-7xl"
        )}>
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
          da SCTI 2025. Conheça os parceiros que acreditam no potencial dos
          estudantes universitários.
        </p>
        <div className="w-full overflow-auto">
          <AutoScrollSponsors
            scale="scale-[90%]"
            sponsors={[{ text: "Alura", imagePath: "alura-light.svg" }, {text: "Código de Ouro", imagePath: "/img/sponsors/codigoouro.png"}]}
          />
        </div>
        <h2 className="text-4xl font-bold my-4">Nossos Apoiadores</h2>
        <div className="flex flex-wrap items-center gap-4 mt-2">
          {allSupporters && allSupporters.length > 0 ? (
            allSupporters.map((prod, i) => (
              <React.Fragment key={prod.id}>
                <p>{prod.Name} {prod.last_name} X {prod.quantity}</p>
                {i < allSupporters.length - 1 && <span>•</span>}
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
