import {
  SetObsAltitude,
  SetProgrammaticIndexCorrectionMinutes,
  SetSelBodyAltLimb,
  SetSextantAngle,
} from "../legacyBridge";

export function applySextantAndCorrections(
  angle: number,
  indexErrorMinutes: number,
  observerAltitudeM: number,
  limbIndex: number
): void {
  SetProgrammaticIndexCorrectionMinutes(indexErrorMinutes);
  SetSextantAngle(angle);
  SetObsAltitude(observerAltitudeM);
  SetSelBodyAltLimb(limbIndex);
}
