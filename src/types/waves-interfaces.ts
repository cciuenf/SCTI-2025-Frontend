import type { waveFormulas } from "@/lib/wave-formulas-utils";

export type WaveConfig = {
  amplitude: number;
  wavelength: number;
  speed: number;
  baseline: number;
  color: string;
  opacity?: number;
  formula: { name: keyof typeof waveFormulas };
  shadow?: { enabled?: boolean; color?: string; blur?: number; offsetX?: number; offsetY?: number };
};