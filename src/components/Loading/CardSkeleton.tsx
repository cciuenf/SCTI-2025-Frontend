import { cn } from "@/lib/utils";

interface CardSkeletonProps {
  count?: number;
  className?: string;
}

const CardSkeleton = ({ count = 3, className }: CardSkeletonProps) => {
  const skeletons = Array.from({ length: count }, (_, i) => i);

  return (
    <div className={cn("grid justify-center md:grid-cols-2 lg:grid-cols-3 gap-4", className)}>
      {skeletons.map((index) => (
        <div
          key={index}
          className={cn(
            "not-md:min-w-80 min-w-auto flex flex-col justify-left items-center bg-white rounded-lg shadow-md",
            "px-1 py-3"
          )}
        >
          <div className="w-full flex flex-col justify-around items-start gap-3.5 px-2">
            {/* Badge and Icons */}
            <div className="w-full flex justify-between items-center mb-1">
              <div className="h-6 w-24 bg-muted rounded-full" />
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 bg-muted rounded" />
                <div className="h-5 w-5 bg-muted rounded" />
                <div className="h-5 w-5 bg-muted rounded" />
              </div>
            </div>
            {/* Título */}
            <div className="h-6 w-3/4 bg-muted rounded mb-1" />
            {/* Data */}
            <div className="flex items-center mb-1">
              <div className="h-4 w-4 bg-muted rounded mr-2.5" />
              <div className="h-4 w-24 bg-muted rounded" />
            </div>
            {/* Local */}
            <div className="flex items-center mb-1">
              <div className="h-4 w-4 bg-muted rounded mr-2.5" />
              <div className="h-4 w-20 bg-muted rounded" />
            </div>
            {/* Description */}
            <div className="h-9 w-full bg-muted rounded mb-1" />
            {/* Button */}
            <div className="w-full h-9 bg-muted rounded shadow-md mt-2" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardSkeleton; 