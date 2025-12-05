export function normalizeToRange(
  value: number,
  min: number = 0,
  max: number = 1,
): number {
  if (Number.isNaN(value) || !Number.isFinite(value)) {
    return min;
  }

  return Math.max(min, Math.min(max, value));
}
