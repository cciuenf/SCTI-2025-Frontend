import { Signal } from "lucide-react";
import { Badge } from "../ui/badge";
import React from "react";

type Props = {
  level: string;
  icon?: boolean;
};

const LevelBadge = ({ level, icon = false }: Props) => {
  if (level == "none") {
    return;
  }
  if (level == "easy" && icon == true) {
    return (
      <div className="bg-green-300 text-green-600 rounded-full w-5 h-5 flex justify-center items-center truncate overflow-hidden whitespace-nowrap">
        <Signal className="w-3 h-3" />
      </div>
    );
  }
  if (level == "easy") {
    return (
      <Badge className="bg-green-300 text-green-600 max-w-[120px] truncate overflow-hidden whitespace-nowrap">
        Iniciante
      </Badge>
    );
  }
  if (level == "medium" && icon == true) {
    return (
      <div className="bg-yellow-200 text-yellow-500 rounded-full w-5 h-5 flex justify-center items-center -5 truncate overflow-hidden whitespace-nowrap">
        <Signal className="w-3 h-3" />
      </div>
    );
  }
  if (level == "medium") {
    return (
      <Badge className="bg-yellow-200 text-yellow-500 max-w-[120px] truncate overflow-hidden whitespace-nowrap">
        Intermediário
      </Badge>
    );
  }

  if (level == "hard" && icon == true) {
    return (
      <div className="bg-red-400/90 text-red-600 rounded-full w-5 h-5 flex justify-center items-center v5rflow-hidden whitespace-nowrap">
        <Signal className="w-3 h-3" />
      </div>
    );
  }
  if (level == "hard") {
    return (
      <Badge className="bg-red-400/90 text-red-600 max-w-[120px] truncate overflow-hidden whitespace-nowrap">
        Avançado
      </Badge>
    );
  }
};

export default LevelBadge;
