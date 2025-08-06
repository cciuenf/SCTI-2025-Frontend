import React from "react";

type Props = {
  type: "amount" | "user";
  data: { label: string; content: string | undefined };
};

const TopCard = ({ type, data }: Props) => {
  if (type == "amount") {
    return (
      <>
        <div className="w-2/5 lg:w-3/10 flex flex-col justify-between items-start shadow-sm rounded-md px-3 py-2 min-h-28">
          <h2 className="text-base sm:text-2xl font-bold">{data.label}</h2>
          <h2 className="text-xl text-accent sm:text-3xl">{data.content}</h2>
        </div>
      </>
    );
  }

  return (
    <div className="w-4/5 lg:w-1/3 flex flex-col justify-between items-start shadow-sm rounded-md px-3 py-2 min-h-28">
      <h2 className="text-base sm:text-2xl font-bold">{data.label}</h2>
      <h2 className="text-base sm:text-xl">{data.content}</h2>
    </div>
  );
};

export default TopCard;
