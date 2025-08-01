"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { User, CreditCard, BoxIcon, LockIcon } from "lucide-react";
type Props = {};

const ProfileTabs = (props: Props) => {
  const [currentView, setCurrentView] = useState<string>("infos");
  const router = useRouter();

  const handleViewChange = (newView: string) => {
    setCurrentView(newView);
    router.push(`profile?view=${newView}`);
  };

  return (
    <div className="w-4/5 flex items-center justify-around border-1 border-secondary bg-secondary rounded-md p-1 gap-1">
      <div
        className={cn(
          "w-1/4 flex items-center justify-center gap-2 cursor-pointer py-3 px-1 duration-300 rounded-md text-zinc-100 hover:bg-zinc-100 hover:text-secondary",
          currentView == "infos" && "bg-zinc-100 text-secondary"
        )}
        onClick={() => handleViewChange("infos")}
      >
        <User className="hidden md:block md:w-5 md:h-5" />
        <h2 className="text-[10px] md:text-base lg:text-xl">Informações</h2>
      </div>
      <div
        className={cn(
          "w-1/4 flex items-center justify-center gap-2 cursor-pointer py-3 px-1 duration-300 rounded-md text-zinc-100 hover:bg-zinc-100 hover:text-secondary",
          currentView == "products" && "bg-zinc-100 text-secondary"
        )}
        onClick={() => handleViewChange("products")}
      >
        <BoxIcon className="hidden md:block md:w-5 md:h-5" />
        <h2 className="text-[10px] md:text-base lg:text-xl">Produtos</h2>
      </div>
      <div
        className={cn(
          "w-1/4 flex items-center justify-center gap-2 cursor-pointer py-3 px-1 duration-300 rounded-md text-zinc-100 hover:bg-zinc-100 hover:text-secondary",
          currentView == "shopping" && "bg-zinc-100 text-secondary"
        )}
        onClick={() => handleViewChange("shopping")}
      >
        <CreditCard className="hidden md:block md:w-5 md:h-5" />
        <h2 className="text-[10px] md:text-base lg:text-xl">Compras</h2>
      </div>
      <div
        className={cn(
          "w-1/4 flex items-center justify-center gap-2 cursor-pointer py-3 px-1 duration-300 rounded-md text-zinc-100 hover:bg-zinc-100 hover:text-secondary",
          currentView == "security" && "bg-zinc-100 text-secondary"
        )}
        onClick={() => handleViewChange("security")}
      >
        <LockIcon className="hidden md:block md:w-5 md:h-5" />
        <h2 className="text-[10px] md:text-base lg:text-xl">Segurança</h2>
      </div>
    </div>
  );
};

export default ProfileTabs;
