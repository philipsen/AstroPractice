/** -------- Formatting helpers -------- **/
/** Format decimal degrees as: 36°22.9′ (round to 0.1′) */
export function formatDeg(dec: number): string {
  const sign = dec < 0 ? '− ' : '';
  const abs = Math.abs(dec);
  const deg = Math.floor(abs);
  const min = (abs - deg) * 60;
  const minRounded = Math.round(min * 10) / 10;
  return `${sign}${deg}°${minRounded.toFixed(1)}′`;
}
/** Convert signed minutes to signed decimal degrees */
export function minutesToDeg(min: number): number {
  return (min || 0) / 60;
}
/** Format a signed minutes value as "± 0°03.5′" */
export function formatMinutesAsDegMin(minSigned: number): string {
  const signStr = minSigned < 0 ? '− ' : '+ ';
  const absMin = Math.abs(minSigned);
  // show 0°MM.m′ (keeping degrees field for alignment; minutes rarely exceed 60 here)
  const deg = Math.floor(absMin / 60); // usually 0
  const mins = absMin - deg * 60;
  const minsRounded = Math.round(mins * 10) / 10;
  return `${signStr}${deg}°${minsRounded.toFixed(1)}′`;
}
