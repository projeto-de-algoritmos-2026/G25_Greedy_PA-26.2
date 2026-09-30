export const MINUTES_PER_DAY = 24 * 60;

export function toMinutes(hours: number, minutes: number): number {
  return Math.max(0, Math.floor(hours) * 60 + Math.floor(minutes));
}

/** 150 -> "2h 30min", 45 -> "45min", 120 -> "2h" */
export function formatMinutes(total: number): string {
  const rounded = Math.round(total);
  const h = Math.floor(rounded / 60);
  const m = rounded % 60;
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

export function formatPercent(fraction: number): string {
  return `${Math.round(fraction * 100)}%`;
}

export function formatNumber(value: number, digits = 2): string {
  return Number.isInteger(value)
    ? String(value)
    : value.toFixed(digits).replace(".", ",");
}
