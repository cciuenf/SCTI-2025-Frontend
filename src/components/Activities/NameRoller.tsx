"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { RotateCw, LogOut, Loader2, Sparkles } from "lucide-react";
import type { UserBasicInfo } from "@/types/auth-interfaces";

const titleCase = (s: string) =>
  s
    .toLocaleLowerCase()
    .split(/\s+/)
    .map(w =>
      w
        .split("-")
        .map(p => (p ? p[0].toLocaleUpperCase() + p.slice(1) : p))
        .join("-")
    )
    .join(" ");

const displayName = (u: UserBasicInfo) =>
  titleCase(
    `${u.Name ?? ""}${u.LastName ?? u.last_name ? " " + (u.LastName ?? u.last_name) : ""}`.trim()
  );

const shuffle = <T,>(arr: T[]) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

function makeDelays(steps: number, totalMs: number, prefersReduced: boolean) {
  if (steps <= 0) return [];
  if (prefersReduced || steps === 1) return Array(steps).fill(Math.floor(totalMs / steps));

  const fastPortion = 0.2;
  const stepsFast = Math.max(1, Math.floor(steps * fastPortion));
  const stepsSlow = Math.max(0, steps - stepsFast);

  const weights: number[] = [];
  for (let i = 0; i < stepsFast; i++) weights.push(1);
  const k = 2.2;
  for (let i = 0; i < stepsSlow; i++) {
    const t = stepsSlow === 1 ? 1 : i / (stepsSlow - 1);
    weights.push(1 + k * t * t);
  }

  const sumW = weights.reduce((s, w) => s + w, 0);
  let delays = weights.map(w => (w / sumW) * totalMs);

  const minPerStep = 30;
  const lifted = delays.map(d => Math.max(minPerStep, d));
  const liftSum = lifted.reduce((s, d) => s + d, 0);
  const scale = totalMs / liftSum;
  delays = lifted.map(d => d * scale);

  const rounded = delays.map(d => Math.max(1, Math.round(d)));
  const diff = totalMs - rounded.reduce((s, d) => s + d, 0);
  if (diff !== 0) rounded[rounded.length - 1] += diff;

  return rounded;
}

function buildSequence(
  users: UserBasicInfo[],
  winner: UserBasicInfo | null,
  countExcludingWinner: number
) {
  if (!users?.length) return winner ? [winner] : [];
  const pool = users.filter(u => (winner ? u.Email !== winner.Email : true));
  if (!pool.length && !winner) return [];

  const avoidAdj = pool.length > 1;

  const seq: UserBasicInfo[] = [];
  let i = 0;
  let tries = 0;
  const guard = countExcludingWinner * 20 + 200;

  const base = shuffle(pool);

  while (seq.length < countExcludingWinner && tries++ < guard) {
    const cand = base[i++ % base.length];
    if (avoidAdj && seq.length && seq[seq.length - 1].Email === cand.Email) {
      const alt = base.find(u => u.Email !== seq[seq.length - 1].Email) ?? cand;
      seq.push(alt);
    } else {
      seq.push(cand);
    }
  }

  if (winner) seq.push(winner);
  return seq;
}

type NameRollerProps = {
  users: UserBasicInfo[];
  winner: UserBasicInfo | null;
  onDone?: () => void;
  onExit?: () => void;
  onReplay?: () => Promise<void>;
  minCount?: number;
  durationSec?: number;
  replayLabel?: string;
  exitLabel?: string;
};

export default function NameRoller({
  users,
  winner,
  onDone,
  onExit,
  onReplay,
  minCount,
  durationSec = 14,
  replayLabel = "Rodar de novo",
  exitLabel = "Sair",
}: NameRollerProps) {
  const prefersReduced = useReducedMotion();
  const totalMs = Math.max(500, Math.round(durationSec * 1000));

  const intendedCount = Math.max(minCount ?? 1, users.length);
  const countExcludingWinner = Math.max(0, intendedCount - (winner ? 1 : 0));
  const order = useMemo(
    () => buildSequence(users, winner, countExcludingWinner),
    [users, winner, countExcludingWinner]
  );

  const delays = useMemo(
    () => makeDelays(order.length, totalMs, !!prefersReduced),
    [order.length, totalMs, prefersReduced]
  );

  const [idx, setIdx] = useState(0);
  const [finished, setFinished] = useState(false);
  const [replaying, setReplaying] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    setIdx(0);
    setFinished(order.length === 0);
    if (timerRef.current) window.clearTimeout(timerRef.current);
  }, [order.length]);

  useEffect(() => {
    if (!order.length || finished) return;

    const steps = order.length;
    const delay = delays[Math.min(idx, delays.length - 1)];

    if (idx < steps - 1) {
      timerRef.current = window.setTimeout(() => setIdx(i => i + 1), delay);
    } else {
      timerRef.current = window.setTimeout(() => {
        setFinished(true);
        onDone?.();
      }, delay);
    }

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [idx, order.length, finished, onDone, delays]);

  const doReplay = useCallback(async () => {
    try {
      setReplaying(true);
      if (onReplay) await onReplay();
      setIdx(0);
      setFinished(false);
    } finally {
      setReplaying(false);
    }
  }, [onReplay]);

  const handleExit = useCallback(() => {
    if (onExit) onExit();
    else window.dispatchEvent(new CustomEvent("name-roller-exit"));
  }, [onExit]);

  const hasOrder = order.length > 0;
  const current = hasOrder ? order[idx] : null;
  const isWinner = !!(winner && current && current.Email === winner.Email);
  const appearanceKey = hasOrder ? `${current!.Email}-${idx}` : `empty-${idx}`;

  const inOut = prefersReduced ? 0 : 0.28;
  const hold = prefersReduced ? 0 : 0.35;

  const initial = prefersReduced
    ? { opacity: 1 }
    : { opacity: 1, scale: 0.75, y: 6, rotate: 0.0001 };
  const animate = prefersReduced
    ? { opacity: 1 }
    : { opacity: 1, scale: isWinner ? 1.08 : 1.0, y: 0, rotate: 0.0001 };

  const showButtons = finished || users.length === 0;

  return (
    <div className="relative flex items-center justify-center flex-col gap-6 px-6">
      <div
        className="relative w-full flex items-center justify-center"
        style={{ minHeight: "5.5rem" }}
      >
        {hasOrder ? (
          <motion.div
            key={appearanceKey}
            initial={initial}
            animate={animate}
            transition={{ ease: [0.16, 1, 0.3, 1], duration: inOut }}
            className="px-4 absolute inset-0 flex items-center justify-center will-change-transform"
            style={{ backfaceVisibility: "hidden", transformStyle: "preserve-3d" }}
          >
            <div className="relative flex items-center justify-center">
              {isWinner && (
                <motion.span
                  initial={{ scale: 0.9, rotate: -6 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="pointer-events-none absolute -top-14 left-1/2 -translate-x-1/2"
                  aria-hidden
                >
                  <Sparkles className="w-12 h-12 md:w-16 md:h-16 text-yellow-300 drop-shadow-[0_0_22px_rgba(255,215,0,0.9)]" />
                </motion.span>
              )}
              <motion.span
                animate={
                  prefersReduced
                    ? undefined
                    : isWinner
                    ? { scale: [1.0, 1.08, 1.02, 1.1, 1.0] }
                    : { scale: [1.0, 1.015, 1.0] }
                }
                transition={prefersReduced ? undefined : { duration: hold * 2, ease: "easeInOut" }}
                className={[
                  "font-extrabold drop-shadow-xl select-none w-screen relative rounded-2xl",
                  isWinner
                    ? "text-yellow-300 text-4xl md:text-6xl lg:text-7xl"
                    : "text-white text-3xl md:text-5xl",
                  "px-4 py-3 md:px-6 md:py-4",
                ].join(" ")}
                style={{
                  textShadow: isWinner
                    ? "0 0 22px rgba(253,224,71,0.85), 0 2px 18px rgba(0,0,0,0.45)"
                    : "0 0 14px rgba(255,255,255,0.55), 0 2px 14px rgba(0,0,0,0.4)",
                }}
              >
                {displayName(current!)}
              </motion.span>
            </div>
          </motion.div>
        ) : (
          <div className="px-4 absolute inset-0 flex items-center justify-center">
            <span className="text-white/80 text-2xl md:text-3xl font-semibold select-none">
              Nenhum participante
            </span>
          </div>
        )}
      </div>

      {!prefersReduced && hasOrder && order.length > 1 && (
        <div className="relative w-80 h-2 rounded-full overflow-hidden bg-white/20 ring-1 ring-white/30">
          <motion.div
            className="h-full bg-white"
            initial={{ width: "0%" }}
            animate={{ width: `${((idx + 1) / order.length) * 100}%` }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          />
        </div>
      )}

      <div className="flex flex-wrap gap-3 min-h-[3rem] items-center justify-center">
        <button
          onClick={doReplay}
          disabled={replaying}
          className={[
            "group inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 cursor-pointer",
            "font-semibold shadow-lg focus:outline-none focus:ring-2 focus:ring-white/60",
            "bg-white text-slate-900 hover:bg-white/95 active:scale-[0.99]",
            "transition transform disabled:cursor-not-allowed disabled:opacity-70",
            showButtons ? "visible" : "invisible pointer-events-none",
          ].join(" ")}
        >
          {replaying ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RotateCw className="w-4 h-4 group-hover:rotate-90 transition-transform" />
          )}
          {replayLabel}
        </button>

        <button
          onClick={handleExit}
          className={[
            "inline-flex items-center gap-2 rounded-2xl px-5 py-2.5",
            "font-semibold border border-white/50 text-white",
            "bg-white/10 hover:bg-white/20 backdrop-blur",
            "focus:outline-none focus:ring-2 focus:ring-white/40 active:scale-[0.99]",
            "transition cursor-pointer",
            showButtons ? "visible" : "invisible pointer-events-none",
          ].join(" ")}
        >
          <LogOut className="w-4 h-4" />
          {exitLabel}
        </button>
      </div>
    </div>
  );
}
