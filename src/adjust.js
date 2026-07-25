import { palettes, listPalettes } from "./palettes.js";
import { darken, lighten } from "./color-utils.js";

export function adjustLtc(palette, amount = 0, which = null) {
  let pal;
  let palName;
  if (typeof palette === "string") {
    if (palettes[palette]) {
      pal = palettes[palette].slice();
      palName = palette;
    } else {
      throw new Error(`Palette '${palette}' not found.`);
    }
  } else if (Array.isArray(palette)) {
    pal = palette.slice();
    palName = "custom";
  } else {
    throw new Error("palette must be a palette name or array of hex colors");
  }

  if (typeof amount !== "number" || isNaN(amount)) {
    throw new Error("amount must be a single numeric value between -100 and 100");
  }

  const idx = which === null
    ? pal.map((_, i) => i)
    : (Array.isArray(which) ? which.map(w => w - 1) : []);

  for (const i of idx) {
    if (i >= 0 && i < pal.length) {
      if (amount < 0) {
        pal[i] = darken(pal[i], Math.abs(amount));
      } else if (amount > 0) {
        pal[i] = lighten(pal[i], amount);
      }
    }
  }

  return pal;
}

export function customAdjustLtc(palette, adjustments) {
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

  if (!Array.isArray(adjustments) || adjustments.length !== pal.length) {
    throw new Error(`adjustments must be an array of same length as palette (${pal.length} colors)`);
  }

  for (let i = 0; i < pal.length; i++) {
    const amt = adjustments[i];
    if (amt < 0) {
      pal[i] = darken(pal[i], Math.abs(amt));
    } else if (amt > 0) {
      pal[i] = lighten(pal[i], amt);
    }
  }

  return pal;
}
