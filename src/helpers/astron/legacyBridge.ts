/**
 * Sole import site for Astron.js. UI and init must not import Astron.js directly.
 * Replace this bridge when a native engine reaches golden-test parity.
 */
export {
  AstronSetBody,
  BODY_DATA,
  BODY_NAMES,
  Calc,
  COL,
  Degs_f,
  GetLongitude,
  InitialiseBODY_DATA,
  OBSERVED_ALT,
  PopulateBODY_DATA_WithBodyNames,
  PopulateBODY_DATA_WithStarData,
  PopulateBODY_NAMES,
  RefrCorr,
  SEL_BODY_OBJ,
  SEL_BODY_ROW,
  SetDatetime,
  SetObsAltitude,
  SetProgrammaticIndexCorrectionMinutes,
  SetPosition,
  SetSelBodyAltLimb,
  SetSextantAngle,
} from "./Astron";
