"use client";
import React from "react";
import { Button } from "../ui/button";
import ProductListSection from "../Products/ProductListSection";

type Props = {
  currentView: string;
};

const ProfileInfos = ({ currentView }: Props) => {
  console.log(currentView);
  return (
    <div className="w-4/5 flex flex-col items-center justify-around gap-3 mx-auto">
      {(currentView == "infos" || currentView == undefined) && (
        <>
          <h2 className="text-4xl">Informações do Usuário</h2>
          <p className="text-md font-light">Gerencie aqui as informações do seu perfil!</p>
          <div className="w-full flex justify-between items-center">
            <div className="w-1/3 flex flex-col gap-3 items-center">
              <h2 className="text-2xl">Nome do usuário: Nome</h2>
              <h2 className="text-2xl">E-mail do usuário: E-mail</h2>
              <Button>Verificar conta</Button>
              <Button>Editar perfil</Button>
            </div>
            <div className="w-1/3 flex flex-col gap-3 items-center">
              <h2 className="text-2xl">Informações de Login</h2>
              <h2 className="text-2xl">Local, dia, sistema operacional</h2>
              <Button>Encerrar sessão</Button>
            </div>
          </div>
        </>
      )}
      {currentView == "products" && (
        <>
          <h2 className="text-4xl">Meus Produtos</h2>
          <p className="text-md font-light">Visualize todos os seus produtos</p>
          <ProductListSection
            currentEvent={{ id: "123", slug: "juanevento123" }}
          />
        </>
      )}

      {currentView == "shopping" && (
        <>
          <h2 className="text-4xl">Histórico de Compras</h2>
          <p className="text-md font-light">Visualize todas as suas transações</p>
        </>
      )}

      {currentView == "security" && (
        <>
          <h2 className="text-4xl">Histórico de Login</h2>
          <p className="text-md font-light">Monitore os acessos à sua conta</p>
        </>
      )}
    </div>
  );
};

export default ProfileInfos;
