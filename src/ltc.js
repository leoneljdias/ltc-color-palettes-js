import { palettes } from "./palettes.js";
import { colorRamp } from "./color-utils.js";

function resolvePalette(name) {
  if (typeof name === "string") {
    if (palettes[name]) return name;
    return null;
  }
  return null;
}

export function ltc(name, n, type = "discrete") {
  const palName = resolvePalette(name);
  if (!palName) {
    throw new Error(`Palette '${name}' not found. Use listPalettes() to see available palettes.`);
  }
  const pal = palettes[palName];
  const count = n !== undefined ? n : pal.length;

  if (type === "discrete") {
    if (count > pal.length) {
      throw new Error("Number of requested colors greater than what palette can offer");
    }
    return pal.slice(0, count);
  }

  if (type === "continuous" || type === "diverging") {
    return colorRamp(pal, count);
  }

  throw new Error("type must be 'discrete', 'continuous', or 'diverging'");
}
