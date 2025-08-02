import React from "react";

type Props = {};

const ProductsDashboardCard = (props: Props) => {
  return (
    <div className="w-1/3 min-h-72 flex flex-col items-start gap-3 rounded-md shadow-sm">
      <h2 className="text-2xl pl-2">Meus Produtos</h2>

      <div className="w-full px-2">
        <p className="w-full border-b-1 border-accent flex justify-between items-center text-xl">
          Produto X<span className="text-accent text-xl">XX.XX R$</span>
        </p>
      </div>
    </div>
  );
};

export default ProductsDashboardCard;
