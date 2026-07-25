export function hexToRgb(hex) {
  let h = hex.replace("#", "");
  if (h.length === 3) {
    h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  }
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16)
  };
}

export function rgbToHex(r, g, b) {
  const toHex = (v) => {
    const clamped = Math.max(0, Math.min(255, Math.round(v)));
    return clamped.toString(16).padStart(2, "0").toUpperCase();
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function rgbToHsl(r, g, b) {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6; break;
      case gn: h = ((bn - rn) / d + 2) / 6; break;
      case bn: h = ((rn - gn) / d + 4) / 6; break;
    }
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

export function hslToRgb(h, s, l) {
  const hn = h / 360, sn = s / 100, ln = l / 100;
  if (sn === 0) {
    const v = Math.round(ln * 255);
    return { r: v, g: v, b: v };
  }
  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = ln < 0.5 ? ln * (1 + sn) : ln + sn - ln * sn;
  const p = 2 * ln - q;
  return {
    r: Math.round(hue2rgb(p, q, hn + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, hn) * 255),
    b: Math.round(hue2rgb(p, q, hn - 1 / 3) * 255)
  };
}

export function hexToHsl(hex) {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHsl(r, g, b);
}

export function hslToHex(h, s, l) {
  const { r, g, b } = hslToRgb(h, s, l);
  return rgbToHex(r, g, b);
}

export function lerpColor(a, b, t) {
  const ca = hexToRgb(a), cb = hexToRgb(b);
  return rgbToHex(
    ca.r + (cb.r - ca.r) * t,
    ca.g + (cb.g - ca.g) * t,
    ca.b + (cb.b - ca.b) * t
  );
}

export function colorRamp(colors, n) {
  if (n <= 0) return [];
  if (n === 1) return [colors[0]];
  const result = [];
  const segments = colors.length - 1;
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const seg = Math.min(Math.floor(t * segments), segments - 1);
    const localT = (t * segments) - seg;
    result.push(lerpColor(colors[seg], colors[seg + 1], localT));
  }
  return result;
}

export function adjustLightness(hex, amount) {
  const { h, s, l } = hexToHsl(hex);
  const newL = Math.max(0, Math.min(100, l + amount));
  return hslToHex(h, s, newL);
}

export function darken(hex, amount) {
  return adjustLightness(hex, -amount);
}

export function lighten(hex, amount) {
  return adjustLightness(hex, amount);
}

export function desaturate(hex, amount) {
  const { h, s, l } = hexToHsl(hex);
  const newS = Math.max(0, s * (1 - amount));
  return hslToHex(h, newS, l);
}

const LMS_CONE = [
  [0.31399022, 0.63951294, 0.04649755],
  [0.15537241, 0.75789446, 0.08670142],
  [0.01775239, 0.10944209, 0.87256922]
];

const LMS_INVERSE = [
  [5.47221206, -4.6419601, 0.16963708],
  [-1.1252419, 2.29317094, -0.1678952],
  [0.02980165, -0.19318073, 1.16364789]
];

const PROTAN_MATRIX = [
  [0.0, 1.05118294, -0.05116099],
  [0.0, 1.0, 0.0],
  [0.0, 0.0, 1.0]
];

const DEUTAN_MATRIX = [
  [1.0, 0.0, 0.0],
  [0.9513092, 0.0, 0.04866992],
  [0.0, 0.0, 1.0]
];

const TRITAN_MATRIX = [
  [1.0, 0.0, 0.0],
  [0.0, 1.0, 0.0],
  [-0.86744736, 1.86727089, 0.0]
];

function multiply3x3(mat, vec) {
  return [
    mat[0][0] * vec[0] + mat[0][1] * vec[1] + mat[0][2] * vec[2],
    mat[1][0] * vec[0] + mat[1][1] * vec[1] + mat[1][2] * vec[2],
    mat[2][0] * vec[0] + mat[2][1] * vec[1] + mat[2][2] * vec[2]
  ];
}

export function simulateCVD(hex, type, severity = 1) {
  const { r, g, b } = hexToRgb(hex);
  const linearize = (c) => {
    const v = c / 255;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  const Rlin = linearize(r), Glin = linearize(g), Blin = linearize(b);

  let lms = multiply3x3(LMS_CONE, [Rlin, Glin, Blin]);

  let cvdMat;
  if (type === "protan") cvdMat = PROTAN_MATRIX;
  else if (type === "deutan") cvdMat = DEUTAN_MATRIX;
  else if (type === "tritan") cvdMat = TRITAN_MATRIX;
  else return hex;

  let simLMS = multiply3x3(cvdMat, lms);

  if (severity < 1) {
    simLMS = [
      lms[0] + (simLMS[0] - lms[0]) * severity,
      lms[1] + (simLMS[1] - lms[1]) * severity,
      lms[2] + (simLMS[2] - lms[2]) * severity
    ];
  }

  let simRGB = multiply3x3(LMS_INVERSE, simLMS);

  const gamma = (c) => {
    const v = Math.max(0, Math.min(1, c));
    return v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
  };

  return rgbToHex(
    Math.round(gamma(simRGB[0]) * 255),
    Math.round(gamma(simRGB[1]) * 255),
    Math.round(gamma(simRGB[2]) * 255)
  );
}
