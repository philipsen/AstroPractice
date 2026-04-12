import {
  SetObsAltitude,
  SetIndexCorrectionMinutes,
  SetSelBodyAltLimb,
  SetSextantAngle,
} from "../legacyBridge";

export function applySextantAndCorrections(
  angle: number,
  indexErrorMinutes: number,
  observerAltitudeM: number,
  limbIndex: number
): void {
  SetIndexCorrectionMinutes(indexErrorMinutes);
  SetSextantAngle(angle);
  SetObsAltitude(observerAltitudeM);
  SetSelBodyAltLimb(limbIndex);
}
