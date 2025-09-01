import React from "react";
import collaborators from "@/data/collaborators.json";
import Connector from "@/components/ui/Generic/Connector";
import { cn } from "@/lib/utils";
import { Github, Linkedin } from "lucide-react";

const page = () => {
  return (
    <Connector
      className="text-center flex flex-col items-center !mt-20"
      id="info"
    >
      <div className="w-full max-w-6xl flex flex-col items-center gap-3">
        <h1 className="font-bold text-6xl">Conheça a Nossa Equipe!</h1>
        <h2 className="font-light text-2xl text-center">
          Nossa equipe de colaboradores é formada inteiramente por estudantes de
          Ciência da Computação, que se dedicaram ao máximo para entregar a
          melhor semana acadêmica para todos os participantes.
        </h2>
        <div
          className={cn(
            "flex justify-between items-center relative max-w-[420px] max-h-[320px] ",
            "bg-[url(/collabs/yellow-figure.svg)]",
            "bg-no-repeat bg-cover"
          )}
        >
          <div className="flex flex-col w-1/2 h-[260px] justify-between overflow-hidden">
            <div className="flex flex-col gap-1">
              <h2 className="font-bold text-3xl text-secondary">{`${collaborators[0].last_name}, ${collaborators[0].name}`}</h2>
              <h2 className="font-normal">{collaborators[0].function}</h2>
            </div>
            <div className="flex w-4/5 justify-center gap-2">
              <Linkedin className="w-6 h-6"/>
              <Github className="w-6 h-6"/>
            </div>
          </div>
          <div className="w-[240px] h-[300px] overflow-hidden">
            <img
              src={`${collaborators[0].photo}`}
              alt={`Foto de ${collaborators[0].name} ${collaborators[0].last_name}`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </Connector>
  );
};

export default page;
