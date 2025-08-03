"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from 'react';

interface Props {
  scale?: string;
  text?: string;
}

const RADIUS = 120;
const CENTER_X = 144;
const CENTER_Y = 144;
const SPEED = 0.005;
const MIN_LENGTH = 60;
const SEPARATOR = ' • ';

const Sponsor = ({ scale = "scale-[100%]", text = "Empresa X" }: Props) => {
  const chars = useMemo(() => {
    let fullText = text;
    while ((fullText + SEPARATOR + text).length < MIN_LENGTH) fullText += SEPARATOR + text;
    if (!fullText.endsWith(SEPARATOR.trim())) fullText += SEPARATOR.trimEnd();
    return fullText.split('');
  }, [text]);
  const charCount = chars.length;
  const step = (2 * Math.PI) / (charCount + 1);
  const textRefs = useRef<SVGTextElement[]>([]);
  const angleRef = useRef(0);

  useEffect(() => {
    const animate = () => {
      angleRef.current = (angleRef.current + SPEED) % (2 * Math.PI);
      textRefs.current.forEach((el, i) => {
        const angle = angleRef.current + i * step;
        const x = CENTER_X + RADIUS * Math.cos(angle);
        const y = CENTER_Y + RADIUS * Math.sin(angle);
        const rotate = (angle * 180) / Math.PI + 90;
        el.setAttribute('x', x.toString());
        el.setAttribute('y', y.toString());
        el.setAttribute('transform', `rotate(${rotate} ${x} ${y})`);
      });
      requestAnimationFrame(animate);
    };
    animate();
  }, [step]);

  return (
    <div className={`relative w-72 h-72 ${scale} shrink-0 rounded-full border-4 border-secondary`}>
      <svg
        viewBox="0 0 288 288"
        width="300"
        height="300"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        {chars.map((char, i) => (
          <text
            key={i}
            ref={el => {
              if (el) textRefs.current[i] = el;
            }}
            className="fill-secondary"
            fontSize="18"
            textAnchor="middle"
            dominantBaseline="middle"
            x="0"
            y="0"
            transform="rotate(0 0 0)"
          >
            {char}
          </text>
        ))}
      </svg>
      {/* <svg width="101%" height="101%" viewBox="0 0 288 288" className="absolute -translate-1/2 left-1/2 top-1/2">
        <path 
          id="curve"
          d="M144 264 A120 120 0 1 1 144 24 A120 120 0 1 1 144 264"
          fill="none"
        />
        <text className="fill-secondary animate-pulse" textAnchor="middle">
          <textPath xlinkHref="#curve" className="text-2xl" startOffset="50%">
            <animate
              attributeName="startOffset"
              from="0%"
              to="100%"
              dur="10s"
              repeatCount="indefinite"
            />
            Empresa X
          </textPath>
        </text>
      </svg> */}
      <div className={cn(
        `absolute w-56 h-56 rounded-full border-4 border-secondary`,
        "-translate-1/2 left-1/2 top-1/2 overflow-hidden",
        "flex flex-col justify-center items-center gap-5"
      )}>
        <Image 
          src="/SCT.svg" 
          alt="Logo SCT" 
          width={200} 
          height={200} 
          className="w-32 h-auto"
        />
        <p className="bg-secondary text-primary py-2 w-full">
          Apoiador Diamante
        </p>
      </div>
    </div>
  )
}

export default Sponsor;