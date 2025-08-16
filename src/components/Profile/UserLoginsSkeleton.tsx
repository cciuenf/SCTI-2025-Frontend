import React from "react";
import { Skeleton } from "../ui/skeleton";

type Props = {};

const UserLoginsSkeleton = (props: Props) => {
  return (
    <div className="w-full flex flex-col justify-around items-center gap-2">
      <div className="w-9/10 sm:w-4/5 min-h-[100px] py-2 px-5 flex justify-between items-center border-2 border-muted-foreground/20 rounded-md gap-5 sm:gap-10">
        <div className="flex justify-between items-center gap-2 sm:gap-10">
          <Skeleton className="rounded-full p-3 shadow-2xs w-4 h-4 sm:w-8 sm:h-8 lg:w-12 lg:h-12"></Skeleton>
          <div className="flex flex-col justify-around items-start">
            <Skeleton className="w-32 h-3 mb-1"></Skeleton>
            <Skeleton className="w-28 h-3"></Skeleton>
          </div>
        </div>
        <Skeleton className="h-3 w-20 px-2 py-1 sm:px-4 sm:py-2"></Skeleton>
      </div>
    </div>
  );
};

export default UserLoginsSkeleton;
