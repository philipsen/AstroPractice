import type { ReductionCorrections } from "../../../models/ReductionCorrections";
import type { SextantCorrectionsComputed } from "../../../components/SextantCorrectionsSummary";

/** Fields used by {@link AstronEngine.setObservationData} (matches app observation shape). */
export type ObservationInput = {
  created: Date | string | number;
  delay?: number | null;
  object: string;
  indexError?: number | null;
  angle: number;
  latitude: number;
  longitude: number;
  observerAltitude: number;
  limbType?: number | null;
  limb?: number | null;
};

export type ObjectDataRow = {
  name: string;
  hc: number;
  azimuth: number;
  gha: number;
  declination: number;
  lha: number;
};

export type BestFitObjectRow = ObjectDataRow & {
  hs: number;
  difference: number;
};

export interface AstronEngine {
  init(): void;
  setBody(name: string): void;
  calc(): void;
  setPosition(lat: number, long: number): void;
  setObservationData(obs: ObservationInput): void;
  getSextantCorrections(): SextantCorrectionsComputed;
  getReductionCorrections(): ReductionCorrections;
  getHs(): number;
  getObjectData(): ObjectDataRow[];
  getBestFitObjects(count?: number): BestFitObjectRow[];
  getGha(): number;
  getLha(): number;
  /** Mutable array filled by {@link init}; same reference as legacy Astron. */
  get bodyNames(): string[];
  formatDegrees(
    dd: number,
    name?: string,
    degreePartDigits?: number,
    minutePartDecimalDigits?: number,
    almanac?: boolean
  ): string;
}
