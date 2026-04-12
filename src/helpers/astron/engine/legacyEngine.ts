import type { AstronEngine, ObservationInput } from "./types";
import { formatAngleDegreesMinutes } from "../../formatAngleDegreesMinutes";
import { BODY_NAMES, SetPosition } from "../legacyBridge";
import { effectiveObservationDateUtc } from "../effectiveObservationDateUtc";
import * as legacyAlt from "../subsystems/legacyAltitudeInputs";
import * as legacyBody from "../subsystems/legacyBody";
import * as legacyCompute from "../subsystems/legacyCompute";
import * as legacyInit from "../subsystems/legacyInit";
import * as legacyRead from "../subsystems/legacyReadouts";
import * as legacyTime from "../subsystems/legacyTime";

export class LegacyAstronEngine implements AstronEngine {
  init(): void {
    legacyInit.initialiseCatalog();
  }

  setBody(name: string): void {
    legacyBody.selectBody(name);
  }

  calc(): void {
    legacyCompute.runCalc();
  }

  setPosition(lat: number, long: number): void {
    SetPosition(lat, long);
  }

  setObservationData(obs: ObservationInput): void {
    legacyTime.setUtcInstant(effectiveObservationDateUtc(obs));
    legacyBody.selectBody(obs.object);
    const ie = Number(obs.indexError);
    const limbIdx =
      obs.limbType !== undefined && obs.limbType !== null
        ? obs.limbType
        : obs.limb;
    legacyAlt.applySextantAndCorrections(
      obs.angle,
      Number.isFinite(ie) ? ie : 0,
      obs.observerAltitude,
      limbIdx ?? 2
    );
    SetPosition(obs.latitude, obs.longitude);
    this.calc();
  }

  getSextantCorrections() {
    return legacyRead.readSextantCorrections();
  }

  getReductionCorrections() {
    return legacyRead.readReductionCorrections();
  }

  getHs(): number {
    return legacyRead.readHs();
  }

  getObjectData() {
    return legacyRead.readObjectData();
  }

  getBestFitObjects(count: number = 5) {
    return legacyRead.readBestFitObjects(count);
  }

  getGha(): number {
    return legacyRead.readGha();
  }

  getLha(): number {
    return legacyRead.readLha();
  }

  get bodyNames(): string[] {
    return BODY_NAMES;
  }

  formatDegrees(
    dd: number,
    name = "",
    degreePartDigits = 1,
    minutePartDecimalDigits = 1,
    almanac = false
  ): string {
    const prefix: "" | "N" | "E" =
      name === "N" || name === "E" ? name : "";
    return formatAngleDegreesMinutes(
      dd,
      prefix,
      degreePartDigits,
      minutePartDecimalDigits,
      almanac
    );
  }
}
