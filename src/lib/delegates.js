import { DELEGATES } from "../data.js";

function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Lay the real delegate records (data.js) out as a deterministic organic
 * cluster: the N points nearest the centre of a jittered hex grid, normalised
 * into the 0–200 viewBox. Returns `{ ...delegate, id, cx, cy }`.
 */
export function layoutDelegates() {
  const n = DELEGATES.length;
  const rnd = mulberry32(11);
  const raw = [];
  const s = 1;
  for (let row = -6; row <= 6; row++) {
    for (let col = -6; col <= 6; col++) {
      const x = col * s + (Math.abs(row) % 2 ? s / 2 : 0);
      const y = row * s * 0.88;
      raw.push({ x, y, d: Math.hypot(x, y * 1.06) });
    }
  }
  raw.sort((a, b) => a.d - b.d);
  const picked = raw.slice(0, n).map((p) => ({
    x: p.x + (rnd() - 0.5) * 0.3,
    y: p.y + (rnd() - 0.5) * 0.3,
  }));

  const xs = picked.map((p) => p.x);
  const ys = picked.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const pad = 14;
  const span = 200;

  return picked.map((p, i) => ({
    ...DELEGATES[i],
    id: i,
    cx: pad + ((p.x - minX) / (maxX - minX)) * (span - pad * 2),
    cy: pad + ((p.y - minY) / (maxY - minY)) * (span - pad * 2),
  }));
}
