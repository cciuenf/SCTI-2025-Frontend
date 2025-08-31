"use client";

import { useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

interface ResultOverlayProps {
  open: boolean | null;
  onOpenChange: (open: boolean | null) => void;
  approved: boolean;
  autoCloseMs?: number;
}

export default function ResultOverlay({
  open,
  onOpenChange,
  approved,
  autoCloseMs = 3000,
}: ResultOverlayProps) {
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (!open || !autoCloseMs) return;
    const t = setTimeout(() => onOpenChange(null), autoCloseMs);
    return () => clearTimeout(t);
  }, [open, autoCloseMs, onOpenChange]);

  const bgClass = approved ? "bg-green-600" : "bg-red-700";

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
            bgClass,
          ].join(" ")}
          onClick={() => onOpenChange(null)}
          role="button"
          tabIndex={0}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              background:
                "radial-gradient(60% 60% at 50% 50%, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.25) 70%, rgba(0,0,0,0.45) 100%)",
            }}
          />

          <div className="relative flex flex-col items-center justify-center gap-6 px-6 text-center select-none">
            <motion.span
              initial={{ opacity: 0, y: prefersReduced ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.28, ease: "easeOut" }}
              className="text-white/95 text-5xl md:text-7xl font-extrabold tracking-widest uppercase drop-shadow-xl transform-gpu"
              style={{ letterSpacing: "0.12em" }}
            >
              {approved ? "Aprovado" : "Reprovado"}
            </motion.span>

            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.16, duration: 0.3, ease: "easeOut" }}
              className="text-white/85 text-lg md:text-2xl drop-shadow"
            >
              {approved ? "Acesso liberado" : "Acesso negado"}
            </motion.span>

            {!!autoCloseMs && !prefersReduced && (
              <div className="w-56 md:w-72 h-1.5 bg-white/30 rounded-full overflow-hidden mt-2">
                <motion.div
                  key={autoCloseMs}
                  className="h-full bg-white"
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: autoCloseMs / 1000, ease: "linear" }}
                />
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
