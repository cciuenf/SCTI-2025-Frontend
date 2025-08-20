import { cn } from "@/lib/utils";
import React from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

const Connector = ({ children, className = "", id }: Props) => {
  return (
    <div className="min-h-screen w-full overflow-hidden relative" id={id}>
      <div className="w-full flex flex-col items-center absolute top-0 pointer-events-none">
        <div className="h-5 bg-secondary w-full" />
        <svg 
          className="w-[300%] translate-x-[-0.98%]" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
        >
          <path 
            className="fill-secondary" 
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
          />
        </svg>
      </div>
      <div className={cn("h-full w-full my-20 lg:my-32", className)}>
        {children}
      </div>
      <div className="w-full flex flex-col items-center absolute bottom-0 pointer-events-none">
        <svg 
          className="transform scale-y-[-1] w-[300%] translate-x-[-0.98%] -mb-1" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
        >
          <path 
            className="fill-secondary" 
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
          />
        </svg>
        <div className="h-5 bg-secondary w-full" />
      </div>
    </div>
  )
}

export default Connector;