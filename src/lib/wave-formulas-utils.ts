export type NamedWaveFn = (theta: number) => number;

export type FnNames = "f1" | "f2" | "f3"

/**
 * f1(x) = (sin(x)cos(0.5x) + 0.3*sin(4x+60°) + 1) / 4
**/
const f1: NamedWaveFn = (theta) => {
  const v = (Math.sin(theta) * Math.cos(0.5 * theta) + 
    0.3 * Math.sin(4 * theta + (60 * Math.PI) / 180) + 1) / 4;
  return 2 * v - 1;
};

/**
 * f2(x) = (sin(x) + sin(3x+45°) + 0.5*sin(3x-30°)) / 10
**/
const f2: NamedWaveFn = (theta) => {
  const v = (Math.sin(theta) + Math.sin(3 * theta + (45 * Math.PI) / 180) +
              0.5 * Math.sin(3 * theta - (30 * Math.PI) / 180)) / 10;
  return Math.max(-1, Math.min(1, v * 4));
};

/**
 * f3(x) = (0.6*sin(x-20°) + 0.4*sin(2x+90°) + 0.2*cos(5x-45°) + 2) / 4
**/
const f3: NamedWaveFn = (theta) => {
  const v = (0.6 * Math.sin(theta - (20 * Math.PI) / 180) +
            0.4 * Math.sin(2 * theta + (90 * Math.PI) / 180) +
            0.2 * Math.cos(5 * theta - (45 * Math.PI) / 180) + 2) / 4;
  return 2 * v - 1;
};

export const waveFormulas: Record<FnNames, NamedWaveFn> = { f1, f2, f3 };
