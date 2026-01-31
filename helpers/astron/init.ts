import { SextantCorrectionsComputed } from "../../components/SextantCorrectionsSummary";
import { ReductionCorrections } from "../../models/ReductionCorrections";
import {
  Calc as AstronCalc,
  AstronSetBody,
  SetPosition as AstronSetpos,
  BODY_DATA,
  COL,
  Degs_f as Degs_f_Astron,
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
  SetSelBodyAltLimb,
  SetSextantAngle
} from "../astron/Astron";
const DEBUG_ASTRON = false;
const DEBUG_ASTRON_INIT = false;
export const DegsFormat = Degs_f_Astron;

export function HoeCorr(h: number): number {
  // Height of eye correction in minutes of arc
  // h: height of eye above sea level in meters
  return -1.758 * Math.sqrt(h);
}

export function SetBody(name: string) {
  if (DEBUG_ASTRON_INIT) console.log("SetBody called with name =", name);
  AstronSetBody(name);
}

export function Calc() {
  // console.log("Calc called");
  AstronCalc();
  // console.log("Calc completed", " lha =", BODY_DATA[SEL_BODY_ROW][COL.LHA]);
  if (DEBUG_ASTRON_INIT) console.log("After Calc, SEL_BODY_OBJ =", SEL_BODY_OBJ);
  if (DEBUG_ASTRON) console.log(" body:", BODY_DATA[0]);
}

// TODO: get rid of sign change
export function SetPosition(lat: number, long: number) {
  if (DEBUG_ASTRON) console.log(`SetPosition called with lat = ${lat}, long = ${long}`);
  AstronSetpos(lat, long);
}

export function SetObservationData(obs) {
  if (DEBUG_ASTRON) console.log("SetObservationData called with obs =", obs);
  SetDatetime(obs.created);
  SetBody(obs.object);
  SetSextantAngle(obs.angle);
  SetPosition(obs.latitude, obs.longitude);
  SetObsAltitude(obs.observerAltitude);
  SetSelBodyAltLimb(obs.limb);
  Calc();
}

export function GetSextantCorrections(): SextantCorrectionsComputed {
  return {
    refraction: RefrCorr(SEL_BODY_OBJ.BodyH2),
    sd: SEL_BODY_OBJ.BodySDCorr,
    parallax: SEL_BODY_OBJ.BodyParallaxCorr,
  };
}

export function GetReductionCorrections(): ReductionCorrections {
  // console.log("GetReductionCorrections called", BODY_DATA[SEL_BODY_ROW]);
  // console.log(" lha =", BODY_DATA[SEL_BODY_ROW][COL.LHA], " azm =", BODY_DATA[SEL_BODY_ROW][COL.Azm]);
  return {
    "gha": BODY_DATA[SEL_BODY_ROW][COL.GHA],
    "chosenLongitude": GetLongitude(),
    "declination": BODY_DATA[SEL_BODY_ROW][COL.Dec],
    "lha": BODY_DATA[SEL_BODY_ROW][COL.LHA],
    "hc": BODY_DATA[SEL_BODY_ROW][COL.Hc],
    "azimuth": BODY_DATA[SEL_BODY_ROW][COL.Azm],
    "hs": OBSERVED_ALT,
  } as ReductionCorrections;  
}

export function GetHs(): number {
  return OBSERVED_ALT;
}

export function GetObjectData() {
  const objectData = [];
  
  console.log("GetObjectData called", BODY_DATA.length);
  // Iterate through all bodies in BODY_DATA
  for (let i = 0; i < BODY_DATA.length; i++) {
    const bodyRow = BODY_DATA[i];
    // console.log(" bodyRow =", bodyRow, " Name =", bodyRow[COL.Body]);
    if (bodyRow && bodyRow[COL.Body]) { // Only include bodies with names
      objectData.push({
        name: bodyRow[COL.Body],
        hc: bodyRow[COL.Hc],
        azimuth: bodyRow[COL.Azm],
        gha: bodyRow[COL.GHA],
        declination: bodyRow[COL.Dec],
        lha: bodyRow[COL.LHA]
      });
    }
  }
  // console.log("GetObjectData returning", objectData);
  return objectData;
}

export function GetBestFitObjects(count: number = 5) {
  const hs = GetHs(); // Get observed altitude
  const objectData = [];
  //CalcAllBodiesHcZn();
  // console.log("GetBestFitObjects called, Hs =", hs, "count =", count);
  
  // Iterate through all bodies in BODY_DATA
  for (let i = 0; i < BODY_DATA.length; i++) {
    const bodyRow = BODY_DATA[i];
    if (bodyRow && bodyRow[COL.Body] && bodyRow[COL.Hc] != null) {
      const hc = bodyRow[COL.Hc];
      const diff = Math.abs(hc - hs);
      
      objectData.push({
        name: bodyRow[COL.Body],
        hc: hc,
        hs: hs,
        difference: diff,
        azimuth: bodyRow[COL.Azm],
        gha: bodyRow[COL.GHA],
        declination: bodyRow[COL.Dec],
        lha: bodyRow[COL.LHA]
      });
    }
  }
  
  // Sort by smallest absolute difference and take the requested count
  const sortedObjects = objectData
    .sort((a, b) => a.difference - b.difference)
    .slice(0, count);
  
  // console.log("GetBestFitObjects returning", sortedObjects.length, "objects");
  return sortedObjects;
}

export function GetGha(): number {
  return BODY_DATA[SEL_BODY_ROW][COL.GHA];
}

export function GetLha(): number {
  return BODY_DATA[SEL_BODY_ROW][COL.LHA];
}

export default function InitAstron() {
  console.log("Initializing Astron data...");
  InitialiseBODY_DATA();
  PopulateBODY_NAMES();
  PopulateBODY_DATA_WithBodyNames();
  PopulateBODY_DATA_WithStarData();
}
