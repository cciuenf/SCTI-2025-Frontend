import React from "react";
import { Skeleton } from "../ui/skeleton";

type Props = {};

const ActivitiesDashboardListSkeleton = (props: Props) => {
  return (
    <div className="w-full lg:w-3/5 lg:mx-auto">
      <div className="flex justify-between items-center basis-1/3 text-base sm:text-xl border-l-1 border-muted-foreground/20 pl-2 mb-3">
        <Skeleton className="w-28 h-7"></Skeleton>
        <div className="flex flex-col justify-between">
          <Skeleton className="w-8 h-4 mb-1"></Skeleton>
          <Skeleton className="w-8 h-4"></Skeleton>
        </div>
      </div>
      <div className="flex justify-between items-center basis-1/3 text-base sm:text-xl border-l-1 border-muted-foreground/20 pl-2 mb-3">
        <Skeleton className="w-28 h-7"></Skeleton>
        <div className="flex flex-col justify-between">
          <Skeleton className="w-8 h-4 mb-1"></Skeleton>
          <Skeleton className="w-8 h-4"></Skeleton>
        </div>
      </div>
      <div className="flex justify-between items-center basis-1/3 text-base sm:text-xl border-l-1 border-muted-foreground/20 pl-2 mb-3">
        <Skeleton className="w-28 h-7"></Skeleton>
        <div className="flex flex-col justify-between">
          <Skeleton className="w-8 h-4 mb-1"></Skeleton>
          <Skeleton className="w-8 h-4"></Skeleton>
        </div>
      </div>
    </div>
  );
};

export default ActivitiesDashboardListSkeleton;
