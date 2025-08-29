import type { WaveConfig } from "@/types/waves-interfaces";

type InitMsg = {
  type: "init";
  canvas: OffscreenCanvas;
  dpr: number;
  width: number;   // CSS px
  height: number;  // CSS px
  fps: number;
  waves: WaveConfig[];
  formulas: Record<string, string>;
  autoShadow: boolean;
};

type ResizeMsg = { type: "resize"; width: number; height: number; dpr: number };
type ConfigMsg  = { type: "config"; waves: WaveConfig[]; autoShadow?: boolean };
type PauseMsg   = { type: "pause" };
type ResumeMsg  = { type: "resume" };
type SetFpsMsg  = { type: "setFps"; fps: number };

let offscreen: OffscreenCanvas | null = null;
let ctx: OffscreenCanvasRenderingContext2D | null = null;
let CSSW = 0, CSSH = 0, DPR = 1;
let waves: WaveConfig[] = [];
let running = true;
let timer: number | null = null;
let targetDt = 1000 / 30;
let autoShadow = true;

let namedFns: Record<string, (theta: number) => number> = {};

function startLoop() { stopLoop(); timer = (self).setInterval(draw, targetDt) as number; }
function stopLoop() { if (timer != null) { (self).clearInterval(timer); timer = null; } }

function resizeBackingStore() {
  if (!offscreen) return;
  offscreen.width  = Math.max(1, Math.floor(CSSW * DPR));
  offscreen.height = Math.max(1, Math.floor(CSSH * DPR));
}

function draw() {
  if (!running || !ctx) return;
  const t = performance.now() / 1000;
  const c = ctx;

  c.setTransform(DPR, 0, 0, DPR, 0, 0);
  c.clearRect(0, 0, CSSW, CSSH);

  for (let i = 0; i < waves.length; i++) {
    const w = waves[i];
    const k = (2 * Math.PI) / w.wavelength;
    const omega = w.speed * k;
    const fn = namedFns[w.formula.name] ?? (() => 0);
    const thetaAt = (x: number) => k * x + omega * t;
    const step = Math.max(1, Math.min(3, Math.floor(w.wavelength / 16)));

    c.beginPath();
    let x = 0;
    let y = w.baseline - w.amplitude * fn(thetaAt(0));
    c.moveTo(0, y);
    for (x = step; x <= CSSW; x += step) {
      y = w.baseline - w.amplitude * fn(thetaAt(x));
      c.lineTo(x, y);
    }
    c.lineTo(CSSW, CSSH);
    c.lineTo(0, CSSH);
    c.closePath();

    c.save();
    if (autoShadow && w.shadow?.enabled !== false) {
      c.shadowColor = w.shadow?.color ?? "rgba(0,0,0,0.25)";
      c.shadowBlur = w.shadow?.blur ?? 8;
      c.shadowOffsetX = w.shadow?.offsetX ?? 0;
      c.shadowOffsetY = w.shadow?.offsetY ?? 3;
    }
    c.fillStyle = w.color as string;
    if (w.opacity != null) { c.globalAlpha = w.opacity; c.fill(); c.globalAlpha = 1; }
    else c.fill(); 
    c.restore();
  }
}

self.onmessage = (ev: MessageEvent<InitMsg | ResizeMsg | ConfigMsg | PauseMsg | ResumeMsg | SetFpsMsg>) => {
  const msg = ev.data;
  switch (msg.type) {
    case "init": {
      offscreen = msg.canvas;
      ctx = offscreen.getContext("2d");
      CSSW = msg.width; CSSH = msg.height; DPR = msg.dpr;
      targetDt = 1000 / Math.max(1, msg.fps || 30);
      waves = msg.waves;
      autoShadow = !!msg.autoShadow;

      namedFns = {};
      for (const [k, body] of Object.entries(msg.formulas)) 
        namedFns[k] = new Function(`return ${body}`)() as (theta: number) => number;
      

      resizeBackingStore();
      startLoop();
      break;
    }
    case "resize": {
      CSSW = msg.width; CSSH = msg.height; DPR = msg.dpr;
      resizeBackingStore();
      break;
    }
    case "config": {
      waves = msg.waves;
      if (typeof msg.autoShadow === "boolean") autoShadow = msg.autoShadow;
      break;
    }
    case "pause":  running = false; break;
    case "resume": running = true;  break;
    case "setFps": {
      targetDt = 1000 / Math.max(1, msg.fps);
      startLoop();
      break;
    }
  }
};
