import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "default" | "dots" | "pulse" | "bars";
  text?: string;
  className?: string;
  spinnerClassName?: string;
}

const LoadingSpinner = ({ 
  size = "md", 
  variant = "default", 
  text,
  className,
  spinnerClassName,
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8", 
    lg: "w-12 h-12",
    xl: "w-16 h-16"
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg", 
    xl: "text-xl"
  };

  const renderSpinner = () => {
    switch (variant) {
      case "dots":
        return (
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
          </div>
        );
      
      case "pulse":
        return (
          <div className={cn(
            "rounded-full bg-current animate-pulse",
            sizeClasses[size],
            spinnerClassName
          )} />
        );
      
      case "bars":
        return (
          <div className="flex space-x-1">
            <div className="w-1 h-4 bg-current animate-pulse [animation-delay:-0.4s]"></div>
            <div className="w-1 h-4 bg-current animate-pulse [animation-delay:-0.2s]"></div>
            <div className="w-1 h-4 bg-current animate-pulse"></div>
            <div className="w-1 h-4 bg-current animate-pulse [animation-delay:-0.2s]"></div>
            <div className="w-1 h-4 bg-current animate-pulse [animation-delay:-0.4s]"></div>
          </div>
        );
      
      default:
        return (
          <div className={cn(
            "border-2 border-current border-t-transparent rounded-full animate-spin",
            sizeClasses[size],
            spinnerClassName
          )} />
        );
    }
  };

  return (
    <div className={cn(
      "flex flex-col items-center justify-center space-y-3",
      className
    )}>
      <div className="text-primary">
        {renderSpinner()}
      </div>
      {text && (
        <p className={cn(
          "text-muted-foreground font-medium",
          textSizeClasses[size]
        )}>
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner; 