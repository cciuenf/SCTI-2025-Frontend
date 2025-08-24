import { cn, formatEventTimeRange } from "@/lib/utils";
import {
  ActivityRegistrationI,
  ActivityResponseI,
} from "@/types/activity-interface";
import React from "react";
import { Badge } from "../ui/badge";
import { CheckCircle, Clock, LoaderIcon, MapPin } from "lucide-react";

type Props = {
  activity: ActivityResponseI;
  userAttends: string[];
};

const ActivityDashboardListItem = ({ activity, userAttends }: Props) => {
  return (
    <div
      key={activity.ID}
      className={cn(
        "flex basis-1/3 min-h-16 py-0.5 justify-between items-center border-l-3 px-2 mb-3 rounded-r-lg",
        {
          "border-secondary text-secondary bg-blue-100":
            new Date(activity.end_time) > new Date(),
          "border-green-800 text-green-800 bg-green-200": userAttends.includes(
            activity.ID
          ),
          "border-red-800 text-red-800 bg-red-200":
            new Date(activity.end_time) < new Date() &&
            !userAttends.includes(activity.ID),
        }
      )}
    >
      <div className="w-full flex flex-col justify-between items-start">
        <p className="text-left max-w-100">{activity.name}</p>
        <div className="flex gap-3 items-center">
          <div className="flex gap-1 items-center">
            <MapPin className="h-3 w-3" />
            <p className="text-xs text-left">{activity.location}</p>
          </div>
          <div className="flex gap-1 items-center">
            <Clock className="h-3 w-3" />
            <p className="text-xs text-left">
              {formatEventTimeRange(
                new Date(activity.start_time),
                new Date(activity.end_time)
              )}
            </p>
          </div>
        </div>
      </div>
      <>
        {!userAttends.includes(activity.ID) &&
          new Date(activity.end_time) > new Date() && (
            <Badge className="bg-blue-200 text-blue-800 rounded-2xl">
              <LoaderIcon className="text-blue-800 h-5 w-5" />
              Inscrito
            </Badge>
          )}
        {userAttends.includes(activity.ID) && (
          <Badge className="bg-green-300 text-green-800 rounded-2xl">
            <CheckCircle className="text-green-800 h-5 w-5" />
            Participou
          </Badge>
        )}
        {!userAttends.includes(activity.ID) &&
          new Date(activity.end_time) < new Date() && (
            <Badge className="bg-red-300 text-red-800 rounded-2xl">
              <CheckCircle className="text-red-800 h-5 w-5" />
              Faltou
            </Badge>
          )}
      </>
    </div>
  );
};

export default ActivityDashboardListItem;
