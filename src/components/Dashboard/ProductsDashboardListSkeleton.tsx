import React from "react";
import { Skeleton } from "../ui/skeleton";

type Props = {};

const ProductsDashboardListSkeleton = (props: Props) => {
  return (
    <div className="flex flex-col">
      <div className="w-full border-b-1 border-muted-foreground/10 flex justify-between items-center text-xl mb-4 py-1 px-2">
        <Skeleton className="w-40 h-4"></Skeleton>
        <Skeleton className="w-20 h-4"></Skeleton>
      </div>{" "}
      <div className="w-full border-b-1 border-muted-foreground/10 flex justify-between items-center text-xl mb-4 py-1 px-2">
        <Skeleton className="w-40 h-4"></Skeleton>
        <Skeleton className="w-20 h-4"></Skeleton>
      </div>{" "}
      <div className="w-full border-b-1 border-muted-foreground/10 flex justify-between items-center text-xl mb-4 py-1 px-2">
        <Skeleton className="w-40 h-4"></Skeleton>
        <Skeleton className="w-20 h-4"></Skeleton>
      </div>{" "}
      <div className="w-full border-b-1 border-muted-foreground/10 flex justify-between items-center text-xl mb-4 py-1 px-2">
        <Skeleton className="w-40 h-4"></Skeleton>
        <Skeleton className="w-20 h-4"></Skeleton>
      </div>
      <div className="w-full border-b-1 border-muted-foreground/10 flex justify-between items-center text-xl mb-4 py-1 px-2">
      <Skeleton className="w-40 h-4"></Skeleton>
      <Skeleton className="w-20 h-4"></Skeleton>
    </div>
    </div>
  );
};

export default ProductsDashboardListSkeleton;
