"use client";
import { useEffect } from "react";

type PixelsTrigger = {
  type: 'pixels';
  value: number;
};

type VhTrigger = {
  type: 'vh';
  value: number;
};

type ElementTrigger = {
  type: 'element';
  value: string; // ID do elemento
};

type ScrollTrigger = PixelsTrigger | VhTrigger | ElementTrigger;

interface ScrollManagerProps {
  trigger?: ScrollTrigger;
  className?: string;
  inverse?: boolean;
}

const ScrollManager = ({ 
  trigger = { type: 'vh', value: 101 },
  className = 'scrollbar-unvisible',
  inverse = false
}: ScrollManagerProps) => {
  useEffect(() => {
    if (inverse) document.body.classList.remove(className);
    else document.body.classList.add(className);

    const getScrollThreshold = (): number => {
      switch (trigger.type) {
        case 'vh':
          if (trigger.value < 0 || trigger.value > 101) 
            return (Math.max(0, Math.min(100, trigger.value)) / 100) * window.innerHeight;
          return (trigger.value / 100) * window.innerHeight;
        case 'element':
          const element = document.getElementById(trigger.value);
          if (!element) return 500;
          return element.offsetTop;
        
        case 'pixels':
        default:
          if (trigger.value < 0) return Math.abs(trigger.value);
          return trigger.value;
      }
    };

    const handleScroll = () => {
      const threshold = getScrollThreshold();
      const isBeforeThreshold = window.scrollY < threshold;
      
      if (inverse) {
        if (isBeforeThreshold) document.body.classList.remove(className);
        else document.body.classList.add(className);
      } else {
        if (isBeforeThreshold) document.body.classList.add(className);
        else document.body.classList.remove(className);
      }
    };

    handleScroll();

    const handleResize = () => {
      if (trigger.type === 'vh') handleScroll();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      document.body.classList.remove(className);
    };
  }, [trigger, className, inverse]);

  return null;
};

export default ScrollManager;