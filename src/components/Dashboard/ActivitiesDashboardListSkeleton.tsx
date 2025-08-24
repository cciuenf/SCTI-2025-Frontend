import React from "react";
import { Skeleton } from "../ui/skeleton";

const ActivitiesDashboardListSkeleton = () => {
  return (
    <div className="w-full flex flex-col gap-3">
      <Skeleton className="w-full px-2 h-16"></Skeleton>
      <Skeleton className="w-full px-2 h-16"></Skeleton>
      <Skeleton className="w-full px-2 h-16"></Skeleton>
    </div>
  );
};

export default ActivitiesDashboardListSkeleton;
