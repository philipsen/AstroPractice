import { SextantCorrectionsComputed } from "../../components/SextantCorrectionsSummary";
import { ReductionCorrections } from "../../models/ReductionCorrections";
import { LegacyAstronEngine } from "./engine/legacyEngine";
import type { AstronEngine, ObservationInput } from "./engine/types";
import { effectiveObservationDateUtc } from "./effectiveObservationDateUtc";
import { BODY_NAMES, Degs_f, SEL_BODY_OBJ } from "./legacyBridge";

const DEBUG_ASTRON = false;
const DEBUG_ASTRON_INIT = false;

let engine: AstronEngine = new LegacyAstronEngine();

/** Test hook: swap engine (e.g. future native implementation). */
export function __setAstronEngineForTests(next: AstronEngine): void {
  engine = next;
}

export { BODY_NAMES, Degs_f, effectiveObservationDateUtc };
export type { AstronEngine, ObservationInput } from "./engine/types";

export const DegsFormat = Degs_f;

export function HoeCorr(h: number): number {
  // Height of eye correction in minutes of arc
  // h: height of eye above sea level in meters
  return -1.758 * Math.sqrt(h);
}

export function SetBody(name: string) {
  if (DEBUG_ASTRON_INIT) console.log("SetBody called with name =", name);
  engine.setBody(name);
}

export function Calc() {
  engine.calc();
  if (DEBUG_ASTRON_INIT)
    console.log("After Calc, SEL_BODY_OBJ =", SEL_BODY_OBJ);
  if (DEBUG_ASTRON) console.log(" body:", engine.getObjectData()[0]);
}

// TODO: get rid of sign change
export function SetPosition(lat: number, long: number) {
  if (DEBUG_ASTRON)
    console.log(`SetPosition called with lat = ${lat}, long = ${long}`);
  engine.setPosition(lat, long);
}

export function SetObservationData(obs: ObservationInput) {
  if (DEBUG_ASTRON) console.log("SetObservationData called with obs =", obs);
  engine.setObservationData(obs);
}

export function GetSextantCorrections(): SextantCorrectionsComputed {
  return engine.getSextantCorrections();
}

export function GetReductionCorrections(): ReductionCorrections {
  return engine.getReductionCorrections();
}

export function GetHs(): number {
  return engine.getHs();
}

export function GetObjectData() {
  const objectData = engine.getObjectData();

  console.log("GetObjectData called", objectData.length);
  return objectData;
}

export function GetBestFitObjects(count: number = 5) {
  return engine.getBestFitObjects(count);
}

export function GetGha(): number {
  return engine.getGha();
}

export function GetLha(): number {
  return engine.getLha();
}

export default function InitAstron() {
  console.log("Initializing Astron data...");
  engine.init();
}
