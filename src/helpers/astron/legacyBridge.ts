/**
 * Sole import site for Astron.js. UI and init must not import Astron.js directly.
 * Replace this bridge when a native engine reaches golden-test parity.
 */
export {
  // Setters — align with observation pipeline: time → body → sextant → position → altitude → limb
  SetDatetime,
  SetBody,
  SetIndexCorrectionMinutes,
  SetSextantAngle,
  SetPosition,
  SetObsAltitude,
  SetSelBodyAltLimb,

  // Full recompute
  Calc,

  // Tables & readouts
  BODY_DATA,
  BODY_NAMES,
  COL,
  GetLongitude,
  OBSERVED_ALT,
  RefrCorr,
  SEL_BODY_OBJ,
  SEL_BODY_ROW,

  // Catalog / BODY_DATA bootstrap
  InitialiseBODY_DATA,
  PopulateBODY_NAMES,
  PopulateBODY_DATA_WithBodyNames,
  PopulateBODY_DATA_WithStarData,
} from "./Astron";
