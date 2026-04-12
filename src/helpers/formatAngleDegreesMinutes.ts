/**
 * Formats a signed angle in degrees as D° MM.m′ (decimal arc minutes).
 * Matches legacy Astron `Degs_f` when Astron uses default `ANGLE_FORMAT` `"DM.m"`.
 */

const MINS_PER_DEGREE = 60;
const DEGS_IN_CIRCLE = 360;
const PRIME = "\u2032"; // ′

function intAbs(n: number): number {
  return Math.floor(Math.abs(n));
}

function mod(a: number, b: number): number {
  return a - b * Math.floor(a / b);
}

function round(value: number, decimals: number): number {
  const multiplier = 10 ** decimals;
  return Math.round(value * multiplier) / multiplier;
}

export type AngleHemispherePrefix = "" | "N" | "E";

/**
 * @param degrees Signed angle in degrees
 * @param hemispherePrefix Optional `"N"` (latitude / declination) or `"E"` (longitude / GHA-style); negative values become S or W
 * @param degreeDigits Min width for the degree field (default 1, or 2 for N / 3 for E when omitted)
 * @param minuteDecimals Decimal places for the minutes field
 * @param almanacStyle If true, omit ° and ′ and use a space between degree and minute tokens
 */
export function formatAngleDegreesMinutes(
  degrees: number,
  hemispherePrefix: AngleHemispherePrefix = "",
  degreeDigits?: number,
  minuteDecimals = 1,
  almanacStyle = false
): string {
  let prefix = "";
  if (hemispherePrefix === "N" || hemispherePrefix === "E") {
    prefix = hemispherePrefix;
  }

  let degDigits: number;
  if (typeof degreeDigits === "number" && !Number.isNaN(degreeDigits)) {
    degDigits = intAbs(degreeDigits);
  } else if (prefix === "N") {
    degDigits = 2;
  } else if (prefix === "E") {
    degDigits = 3;
  } else {
    degDigits = 1;
  }

  let angle = degrees;
  if (prefix === "E" && angle < -180) {
    angle += DEGS_IN_CIRCLE;
  }
  if (prefix === "E" && angle > 180) {
    angle -= DEGS_IN_CIRCLE;
  }

  const isNegative = angle < 0;
  angle = Math.abs(angle);

  const mTotal = round(angle * MINS_PER_DEGREE, minuteDecimals);
  const mins = mod(mTotal, MINS_PER_DEGREE);
  const degs = (mTotal - mins) / MINS_PER_DEGREE;

  let degsStr = String(degs);
  if (degsStr.length > degDigits) {
    degDigits = degsStr.length;
  }
  while (degsStr.length < degDigits) {
    degsStr = "0" + degsStr;
  }

  let minsStr = String(mins.toFixed(minuteDecimals));
  if (mins < 10) {
    minsStr = "0" + minsStr;
  }

  const core = almanacStyle
    ? `${degsStr} ${minsStr}`
    : `${degsStr}° ${minsStr}${PRIME}`;

  if (prefix === "N" && isNegative) return "S" + core;
  if (prefix === "N") return "N" + core;
  if (prefix === "E" && isNegative) return "W" + core;
  if (prefix === "E") return "E" + core;
  if (isNegative) return "-" + core;
  return core;
}
