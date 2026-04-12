import {
  BODY_DATA,
  COL,
  GetLongitude,
  OBSERVED_ALT,
  RefrCorr,
  SEL_BODY_OBJ,
  SEL_BODY_ROW,
} from "../legacyBridge";
import type { BestFitObjectRow, ObjectDataRow } from "../engine/types";
import type { ReductionCorrections } from "../../../models/ReductionCorrections";
import type { SextantCorrectionsComputed } from "../../../components/SextantCorrectionsSummary";

export function readReductionCorrections(): ReductionCorrections {
  return {
    gha: BODY_DATA[SEL_BODY_ROW][COL.GHA],
    chosenLongitude: GetLongitude(),
    declination: BODY_DATA[SEL_BODY_ROW][COL.Dec],
    lha: BODY_DATA[SEL_BODY_ROW][COL.LHA],
    hc: BODY_DATA[SEL_BODY_ROW][COL.Hc],
    azimuth: BODY_DATA[SEL_BODY_ROW][COL.Azm],
    hs: OBSERVED_ALT,
  } as ReductionCorrections;
}

export function readSextantCorrections(): SextantCorrectionsComputed {
  return {
    refraction: RefrCorr(SEL_BODY_OBJ.BodyH2),
    sd: SEL_BODY_OBJ.BodySDCorr,
    parallax: SEL_BODY_OBJ.BodyParallaxCorr,
  };
}

export function readHs(): number {
  return OBSERVED_ALT;
}

export function readGha(): number {
  return BODY_DATA[SEL_BODY_ROW][COL.GHA];
}

export function readLha(): number {
  return BODY_DATA[SEL_BODY_ROW][COL.LHA];
}

export function readObjectData(): ObjectDataRow[] {
  const objectData: ObjectDataRow[] = [];
  for (let i = 0; i < BODY_DATA.length; i++) {
    const bodyRow = BODY_DATA[i];
    if (bodyRow && bodyRow[COL.Body]) {
      objectData.push({
        name: bodyRow[COL.Body],
        hc: bodyRow[COL.Hc],
        azimuth: bodyRow[COL.Azm],
        gha: bodyRow[COL.GHA],
        declination: bodyRow[COL.Dec],
        lha: bodyRow[COL.LHA],
      });
    }
  }
  return objectData;
}

export function readBestFitObjects(count: number): BestFitObjectRow[] {
  const hs = readHs();
  const rows: BestFitObjectRow[] = [];
  for (let i = 0; i < BODY_DATA.length; i++) {
    const bodyRow = BODY_DATA[i];
    if (bodyRow && bodyRow[COL.Body] && bodyRow[COL.Hc] != null) {
      const hc = bodyRow[COL.Hc];
      const diff = Math.abs(hc - hs);
      rows.push({
        name: bodyRow[COL.Body],
        hc,
        hs,
        difference: diff,
        azimuth: bodyRow[COL.Azm],
        gha: bodyRow[COL.GHA],
        declination: bodyRow[COL.Dec],
        lha: bodyRow[COL.LHA],
      });
    }
  }
  return rows.sort((a, b) => a.difference - b.difference).slice(0, count);
}
