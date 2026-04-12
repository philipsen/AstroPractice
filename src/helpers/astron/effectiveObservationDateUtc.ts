/**
 * UTC instant passed to the engine: stored watch/recorded time `created` plus `delay` seconds
 * (chronometer or recording correction). `delay` is in seconds; invalid values are treated as 0.
 */
export function effectiveObservationDateUtc(obs: {
  created: Date | string | number;
  delay?: number | null;
}): Date {
  const ms =
    obs.created instanceof Date
      ? obs.created.getTime()
      : new Date(obs.created).getTime();
  const sec = Number(obs.delay);
  const d = Number.isFinite(sec) ? sec : 0;
  return new Date(ms + d * 1000);
}
