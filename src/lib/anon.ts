// Deterministic anonymous alias + avatar gradient generator.

const ADJECTIVES = [
  "Quiet", "Hidden", "Velvet", "Restless", "Midnight", "Soft", "Wired",
  "Lonely", "Burning", "Crooked", "Sleepless", "Tender", "Honest",
  "Static", "Crimson", "Paper", "Glass", "Iron", "Neon", "Lucid",
];

const NOUNS = [
  "Owl", "Echo", "Comet", "Fox", "Tide", "Ember", "Pixel", "Halo",
  "Drift", "Moth", "Specter", "Atlas", "Riot", "Saint", "Vagrant",
  "Mirror", "Cipher", "Wraith", "Phantom", "Heron",
];

const HUES = [12, 25, 45, 70, 140, 180, 220, 260, 290, 330];

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function aliasFromSeed(seed: string): string {
  const h = hash(seed);
  const a = ADJECTIVES[h % ADJECTIVES.length];
  const n = NOUNS[(h >>> 8) % NOUNS.length];
  const num = (h >>> 16) % 90 + 10;
  return `${a}${n}${num}`;
}

export function gradientFromSeed(seed: string): string {
  const h = hash(seed);
  const h1 = HUES[h % HUES.length];
  const h2 = HUES[(h >>> 8) % HUES.length];
  const angle = (h >>> 16) % 360;
  return `linear-gradient(${angle}deg, oklch(0.70 0.18 ${h1}), oklch(0.55 0.20 ${h2}))`;
}

export function initialsFromAlias(alias: string): string {
  const upper = alias.replace(/[0-9]/g, "");
  const matches = upper.match(/[A-Z][a-z]*/g) ?? [upper];
  return (matches[0]?.[0] ?? "U") + (matches[1]?.[0] ?? "");
}
