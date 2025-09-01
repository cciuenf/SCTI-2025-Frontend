import { WaveCanvasWorker } from "@/components/WaveCanvasWorker";
import { cn } from "@/lib/utils";
import { alternativeWaves } from "@/presets/waves/presets";
import type { WaveConfig } from "@/types/waves-interfaces";

interface Props {
  children: React.ReactNode,
  className?: string,
  topWaves?: WaveConfig[],
  bottomWaves?: WaveConfig[],
  id?: string,
}

const Connector = ({ 
  children, 
  className = "", 
  topWaves = alternativeWaves,
  bottomWaves = alternativeWaves,
  id 
}: Props) => {

  return (
    <div className="min-h-screen w-full overflow-hidden relative" id={id}>
      <div className="w-screen min-w-[320px] flex items-center absolute top-0 pointer-events-none">
        <WaveCanvasWorker
          height={240}
          waves={topWaves}
          autoShadow="auto"
          fps={60}
          className="scale-y-[-1]"
        />
      </div>
      <div className={cn("h-full w-full my-20 lg:my-32", className)}>
        {children}
      </div>
      <div className="w-screen min-w-[320px] flex items-center absolute bottom-0 pointer-events-none">
        <WaveCanvasWorker
          height={240}
          waves={bottomWaves}
          autoShadow="auto"
          fps={60}
        />
      </div>
    </div>
  );
};

export default Connector;
