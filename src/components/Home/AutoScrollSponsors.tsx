"use client";
import { useEffect, useRef, useState } from "react";
import Sponsor from "./Sponsor";

interface Props {
  scale?: string;
  speed?: number;
  delay?: number;
}

const AutoScrollSponsors = ({ scale = "scale-[100%]", speed = 2, delay = 500 }: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const delayActive = useRef(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const interval = setInterval(() => {
      if (paused || delayActive.current) return;

      const atRight = el.scrollLeft + el.clientWidth >= el.scrollWidth;
      const atLeft = el.scrollLeft <= 0;

      if (direction === "right") {
        if (atRight) {
          delayActive.current = true;
          setTimeout(() => {
            setDirection("left");
            delayActive.current = false;
          }, delay);
        } else el.scrollLeft += speed;
      } else {
        if (atLeft) {
          delayActive.current = true;
          setTimeout(() => {
            setDirection("right");
            delayActive.current = false;
          }, delay);
        } else el.scrollLeft -= speed;
      }
    }, 16);

    return () => clearInterval(interval);
  }, [paused, direction, delay, speed, scrollRef]);

  return (
    <div
      className="w-full overflow-x-auto"
      ref={scrollRef}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="flex gap-4 min-w-max px-4 py-2 md:mr-4">
        <Sponsor scale={scale} />
        <Sponsor scale={scale} />
        <Sponsor scale={scale} />
        <Sponsor scale={scale} />
        <Sponsor scale={scale} />
        <Sponsor scale={scale} />
      </div>
    </div>
  );
}

export default AutoScrollSponsors;