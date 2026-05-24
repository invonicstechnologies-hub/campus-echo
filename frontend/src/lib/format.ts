export function compactNumber(n: number): string {
  if (Math.abs(n) < 1000) return String(n);
  if (Math.abs(n) < 1_000_000) return (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1).replace(/\.0$/, "") + "k";
  return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "m";
}

/**
 * Deterministic "X ago" formatter that takes an age in minutes.
 * Using a stable input (not Date.now()) keeps SSR and client output identical
 * and prevents React hydration mismatches.
 */
export function relativeTime(ageMinutes: number): string {
  const m = Math.max(0, Math.floor(ageMinutes));
  if (m < 1) return "just now";
  if (m < 60) return `${m}m`;
  if (m < 60 * 24) return `${Math.floor(m / 60)}h`;
  if (m < 60 * 24 * 7) return `${Math.floor(m / (60 * 24))}d`;
  if (m < 60 * 24 * 30) return `${Math.floor(m / (60 * 24 * 7))}w`;
  return `${Math.floor(m / (60 * 24 * 30))}mo`;
}
