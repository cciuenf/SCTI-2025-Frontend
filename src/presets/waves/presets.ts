import type { WaveConfig } from "@/types/waves-interfaces";

export const baseWaves: WaveConfig[] = [
  {
    amplitude: 20,
    wavelength: 240,
    speed: 20,
    baseline: 170,
    formula: { name: "f1" },
    color: "#e3c817",
    opacity: 1,
    shadow: { enabled: true, color: "rgba(0,0,0,1)", blur: 23, offsetY: 3 },
  },
  {
    amplitude: 20,
    wavelength: 300,
    speed: -15,
    baseline: 195,
    formula: { name: "f2" },
    color: "#ffffff",
    opacity: 1,
    shadow: { enabled: true, color: "rgba(0,0,0,1)", blur: 23, offsetY: 3 },
  },
  {
    amplitude: 20,
    wavelength: 320,
    speed: 10,
    baseline: 210,
    formula: { name: "f3" },
    color: "#00124c",
    opacity: 1,
    shadow: { enabled: true, color: "rgba(0,0,0,1)", blur: 23, offsetY: 3 },
  },
];

export const alternativeWaves: WaveConfig[] = baseWaves.map((w, i) => ({
  ...w,
  color: ["#e3c817", "#00124c", "#ffffff"][i],
}));

export const alternativeInverseWaves: WaveConfig[] = baseWaves.map((w, i) => ({
  ...w,
  color: ["#00124c", "#e3c817", "#ffffff"][i],
}));
