/**
 * Pure spherical sight-reduction helpers for future native ephemeris wiring.
 * Angles in degrees. Not used by LegacyAstronEngine (Astron.js still computes Hc/Zn).
 */

const D2R = Math.PI / 180;
const R2D = 180 / Math.PI;

export function computeHcDegrees(
  latDeg: number,
  decDeg: number,
  lhaDeg: number
): number {
  const lat = latDeg * D2R;
  const dec = decDeg * D2R;
  const lha = lhaDeg * D2R;
  const sinHc =
    Math.sin(lat) * Math.sin(dec) + Math.cos(lat) * Math.cos(dec) * Math.cos(lha);
  const c = Math.min(1, Math.max(-1, sinHc));
  return Math.asin(c) * R2D;
}

/** True azimuth Zn (0°..360°, north=0) from assumed position, dec, LHA, and computed Hc. */
export function computeZnDegrees(
  latDeg: number,
  decDeg: number,
  lhaDeg: number,
  hcDeg: number
): number {
  const lat = latDeg * D2R;
  const dec = decDeg * D2R;
  const lha = lhaDeg * D2R;
  const hc = hcDeg * D2R;
  const cosZ =
    (Math.sin(dec) - Math.sin(lat) * Math.sin(hc)) /
    (Math.cos(lat) * Math.cos(hc));
  const z = Math.acos(Math.min(1, Math.max(-1, cosZ))) * R2D;
  const zn = Math.sin(lha) > 0 ? 360 - z : z;
  return ((zn % 360) + 360) % 360;
}
