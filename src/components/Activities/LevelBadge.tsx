import { Badge } from "../ui/badge";
import React from "react";

type Props = {
  level: string;
};

const LevelBadge = ({ level }: Props) => {
  if (level == "none") {
    return;
  }
  if (level == "easy") {
    return (
      <Badge className="bg-green-300 text-green-600 max-w-[120px] truncate overflow-hidden whitespace-nowrap">
        Iniciante
      </Badge>
    );
  }
  if (level == "medium") {
    return (
      <Badge className="bg-yellow-200 text-yellow-500 max-w-[120px] truncate overflow-hidden whitespace-nowrap">
        Intermediário
      </Badge>
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
