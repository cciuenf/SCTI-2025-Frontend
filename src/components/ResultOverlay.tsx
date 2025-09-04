"use client";

import { useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

interface ResultOverlayProps {
  open: boolean | null;
  onOpenChange: (open: boolean) => void;
  autoCloseMs?: number;
  children: React.ReactNode;
}

export default function ResultOverlay({
  open,
  onOpenChange,
  autoCloseMs,
  children
}: ResultOverlayProps) {
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (!open || !autoCloseMs) return;
    const t = setTimeout(() => onOpenChange(false), autoCloseMs);
    return () => clearTimeout(t);
  }, [open, autoCloseMs, onOpenChange]);

  useEffect(() => {
    if (open) {
      const prevOverflow = document.body.style.overflow;
      const prevPaddingRight = document.body.style.paddingRight;

      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.body.style.overflow = "hidden";

      const prevent = (e: Event) => e.preventDefault();
      window.addEventListener("wheel", prevent, { passive: false });
      window.addEventListener("touchmove", prevent, { passive: false });

      return () => {
        document.body.style.overflow = prevOverflow;
        document.body.style.paddingRight = prevPaddingRight;
        window.removeEventListener("wheel", prevent);
        window.removeEventListener("touchmove", prevent);
      };
    }
  }, [open]);

  const bgClass = "bg-green-600";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0, y: prefersReduced ? 0 : 8, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: prefersReduced ? 0 : -8, filter: "blur(3px)" }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className={[
            "fixed inset-0 z-[1000] flex items-center justify-center",
            "transform-gpu will-change-transform will-change-opacity will-change-filter",
            "overscroll-contain",
            bgClass,
          ].join(" ")}
          role="button"
          tabIndex={0}
          style={{touchAction: "none"}}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              background:
                "radial-gradient(60% 60% at 50% 50%, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.25) 70%, rgba(0,0,0,0.45) 100%)",
            }}
          />
          <div className="relative flex flex-col items-center justify-center gap-6 px-6 text-center select-none">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
