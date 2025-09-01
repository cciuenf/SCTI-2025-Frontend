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
      <div className="w-full max-w-7xl flex flex-col items-center gap-3 py-5">
        <h1 className="font-bold text-5xl"> Organizadores SCTI 2025</h1>
        <h2 className="font-light text-xl text-center">
          Conheça a nossa equipe de colaboradores!
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
