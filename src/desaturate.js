import { palettes } from "./palettes.js";
import { desaturate } from "./color-utils.js";

export function desaturateLtc(palette, amount = 0.5, which = null) {
  let pal;
  if (typeof palette === "string") {
    if (palettes[palette]) {
      pal = palettes[palette].slice();
    } else {
      throw new Error(`Palette '${palette}' not found.`);
    }
  } else if (Array.isArray(palette)) {
    pal = palette.slice();
  } else {
    throw new Error("palette must be a palette name or array of hex colors");
  }

  if (amount < 0 || amount > 1) {
    throw new Error("amount must be between 0 and 1");
  }

  const idx = which === null
    ? pal.map((_, i) => i)
    : (Array.isArray(which) ? which.map(w => w - 1) : []);

  for (const i of idx) {
    if (i >= 0 && i < pal.length) {
      pal[i] = desaturate(pal[i], amount);
    }
  }

  return pal;
}
