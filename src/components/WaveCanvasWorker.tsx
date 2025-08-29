"use client";
import { waveFormulas } from "@/lib/wave-formulas-utils";
import type { WaveConfig } from "@/types/waves-interfaces";
import { useEffect, useRef } from "react";

type Props = {
  className?: string;
  height?: number;
  waves: WaveConfig[];
  fps?: number;             // default 60
  maxDpr?: number;          // default 1.25 mobile / 1.5 desktop
  /** true = always on; false = awalys off; "auto" = disable on mobile */
  autoShadow?: boolean | "auto";
  canvasClassName?: string;
};

export function WaveCanvasWorker({
  className = "",
  height = 280,
  waves,
  fps = 60,
  maxDpr,
  autoShadow = true,
  canvasClassName = "w-full h-full block",
}: Props) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const workerRef = useRef<Worker | null>(null);
  const roRef = useRef<ResizeObserver | null>(null);
  const ioRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const host = hostRef.current!;
    const canvas = document.createElement("canvas");
    canvas.className = canvasClassName;
    canvas.style.width = "100%";
    canvas.style.height = `${height}px`;
    host.appendChild(canvas);

    const supportsOffscreen = "transferControlToOffscreen" in canvas;
    if (!supportsOffscreen) return () => host.removeChild(canvas);

    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const dprCap = maxDpr ?? (isMobile ? 1.25 : 1.5);
    const dpr = Math.min(dprCap, Math.max(1, window.devicePixelRatio || 1));

    // transfer
    const off = (canvas).transferControlToOffscreen() as OffscreenCanvas;
    const worker = new Worker(new URL("@/workers/waveWorker.ts", import.meta.url), { type: "module" });
    workerRef.current = worker;

    const formulasSerialized: Record<string, string> = {};
    for (const [k, fn] of Object.entries(waveFormulas)) formulasSerialized[k] = fn.toString();

    const measure = () => {
      const rect = host.getBoundingClientRect();
      return { width: Math.max(1, Math.round(rect.width)), height: Math.max(1, Math.round(height)) };
    };

    const initSize = measure();

    // resolve autoShadow
    const effectiveAutoShadow = autoShadow === "auto" ? !isMobile : !!autoShadow;

    worker.postMessage(
      {
        type: "init",
        canvas: off,
        dpr,
        width: initSize.width,
        height: initSize.height,
        fps,
        waves,
        formulas: formulasSerialized,
        autoShadow: effectiveAutoShadow,
      },
      [off as unknown as Transferable]
    );

    const sendResize = () => {
      const { width, height: h } = measure();
      worker.postMessage({ type: "resize", width, height: h, dpr });
    };

    roRef.current = new ResizeObserver(sendResize);
    roRef.current.observe(host);
    sendResize();

    const onVis = () => {
      const hidden = document.visibilityState === "hidden";
      worker.postMessage(hidden ? { type: "pause" } : { type: "resume" });
    };
    document.addEventListener("visibilitychange", onVis);

    ioRef.current = new IntersectionObserver(
      (entries) => {
        const vis = entries[0]?.isIntersecting ?? true;
        worker.postMessage(vis ? { type: "resume" } : { type: "pause" });
      },
      { threshold: 0.01 }
    );
    ioRef.current.observe(host);

    return () => {
      roRef.current?.disconnect();
      ioRef.current?.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      workerRef.current?.terminate();
      workerRef.current = null;
      if (canvas.parentNode === host) host.removeChild(canvas);
    };
  }, [autoShadow, canvasClassName, fps, height, maxDpr, waves]);

  useEffect(() => {
    if (!workerRef.current) return;
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const effectiveAutoShadow = autoShadow === "auto" ? !isMobile : !!autoShadow;
    workerRef.current.postMessage({ type: "config", waves, autoShadow: effectiveAutoShadow });
  }, [waves, autoShadow]);

  useEffect(() => {
    workerRef.current?.postMessage({ type: "setFps", fps });
  }, [fps]);

  return (
    <div ref={hostRef} className={className} style={{ width: "100%", height: `${height}px` }} />
  );
}
