"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { User, CreditCard, BoxIcon, LockIcon } from "lucide-react";
type Props = {};

const ProfileBar = (props: Props) => {
  const [currentView, setCurrentView] = useState<string>("infos");
  return (
    <div className="w-4/5 flex items-center justify-around border-1 border-secondary bg-secondary rounded-md p-1 gap-1">
      <div
        className={cn(
          "w-1/4 flex items-center justify-center gap-2 cursor-pointer py-3 px-1 duration-300 rounded-md text-zinc-100 hover:bg-zinc-100 hover:text-secondary",
          currentView == "infos" && "bg-zinc-100 text-secondary"
        )}
        onClick={() => setCurrentView("infos")}
      >
        <User />
        <h2>Informações</h2>
      </div>
      <div
        className={cn(
          "w-1/4 flex items-center justify-center gap-2 cursor-pointer py-3 px-1 duration-300 rounded-md text-zinc-100 hover:bg-zinc-100 hover:text-secondary",
          currentView == "products" && "bg-zinc-100 text-secondary"
        )}
        onClick={() => setCurrentView("products")}
      >
        <BoxIcon />
        <h2>Produtos</h2>
      </div>
      <div
        className={cn(
          "w-1/4 flex items-center justify-center gap-2 cursor-pointer py-3 px-1 duration-300 rounded-md text-zinc-100 hover:bg-zinc-100 hover:text-secondary",
          currentView == "shopping" && "bg-zinc-100 text-secondary"
        )}
        onClick={() => setCurrentView("shopping")}
      >
        <CreditCard />
        <h2>Compras</h2>
      </div>
      <div
        className={cn(
          "w-1/4 flex items-center justify-center gap-2 cursor-pointer py-3 px-1 duration-300 rounded-md text-zinc-100 hover:bg-zinc-100 hover:text-secondary",
          currentView == "security" && "bg-zinc-100 text-secondary"
        )}
        onClick={() => setCurrentView("security")}
      >
        <LockIcon />
        <h2>Segurança</h2>
      </div>
    </div>
  );
};

export default ProfileBar;
