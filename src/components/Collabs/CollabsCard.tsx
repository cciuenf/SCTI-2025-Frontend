import { cn } from "@/lib/utils";
import React from "react";
import SocialIcon from "./SocialIcon";
import Image from "next/image";

type Props = {
  name: string;
  last_name: string;
  photo: string;
  role: string;
  social_1: { icon: string; url: string };
  social_2: { icon: string; url: string };
};

const CollabsCard = ({
  role,
  last_name,
  name,
  photo,
  social_1,
  social_2,
}: Props) => {
  return (
    <div>
      <div
        className={cn(
          "flex justify-between items-center relative max-w-[380px] max-h-[280px] ",
          "bg-[url(/collabs/yellow-figure.svg)]",
          "bg-no-repeat bg-cover"
        )}
      >
        <div className="flex flex-col w-1/2 h-[220px] py-1 pl-8 justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="font-bold text-3xl text-secondary">{`${last_name}, ${name}`}</h2>
            <h2 className="font-normal">{role}</h2>
          </div>
          <div className="flex w-4/5 justify-center gap-2 z-50">
            {<SocialIcon icon={social_1.icon} url={social_1.url} />}
            {<SocialIcon icon={social_2.icon} url={social_2.url} />}
          </div>
        </div>
        <div className="w-[200px] h-[260px] z-40 absolute -bottom-10 -right-5">
          <Image
            width={1500}
            height={800}
            src={photo}
            alt={`Foto de ${name} ${last_name}`}
            className="w-[160px] h-[220px]"
          />
        </div>
      </div>
    </div>
  );
};

export default CollabsCard;
