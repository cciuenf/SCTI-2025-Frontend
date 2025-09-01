import React from "react";
import collaborators from "@/data/collaborators.json";
import Connector from "@/components/ui/Generic/Connector";
import CollabsCard from "@/components/Collabs/CollabsCard";

const page = () => {
  return (
    <Connector
      className="text-center flex flex-col items-center !mt-20"
      id="info"
    >
      <div className="w-full max-w-7xl flex flex-col items-center gap-3">
        <h1 className="font-bold text-6xl">Conheça a Nossa Equipe!</h1>
        <h2 className="font-light text-2xl text-center">
          Nossa equipe de colaboradores é formada inteiramente por estudantes de
          Ciência da Computação, que se dedicaram ao máximo para entregar a
          melhor semana acadêmica para todos os participantes.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collaborators.map((collab) => (
            <CollabsCard
              key={collab.name}
              name={collab.name}
              last_name={collab.last_name}
              photo={collab.photo}
              role={collab.role}
              social_1={collab.social_1}
              social_2={collab.social_2}
            />
          ))}
        </div>
      </div>
    </Connector>
  );
};

export default page;
