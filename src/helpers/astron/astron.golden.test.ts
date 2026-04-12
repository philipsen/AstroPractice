import { describe, expect, it, beforeAll } from "vitest";
import InitAstron, {
  GetBestFitObjects,
  GetGha,
  GetHs,
  GetLha,
  GetReductionCorrections,
  GetSextantCorrections,
  SetObservationData,
} from "./init";
import type { ObservationInput } from "./engine/types";

const EPS = 1e-5;

const GOLDEN_OBS: ObservationInput = {
  created: new Date("2024-06-15T12:00:00.000Z"),
  delay: 0,
  object: "Sun",
  indexError: 0,
  angle: 45,
  latitude: 51.5,
  longitude: -0.12,
  observerAltitude: 3,
  limbType: 2,
};

/** Moon + chronometer delay + index error (minutes) — pins non-Sun and correction inputs. */
const GOLDEN_OBS_MOON: ObservationInput = {
  created: new Date("2024-12-21T08:30:00.000Z"),
  delay: -45,
  object: "Moon",
  indexError: -3,
  angle: 52.25,
  latitude: 40.4,
  longitude: -3.7,
  observerAltitude: 8,
  limbType: 2,
};

function expectClose(
  actual: number,
  expected: number,
  epsilon: number,
  label: string
) {
  expect(Math.abs(actual - expected), label).toBeLessThanOrEqual(epsilon);
}

describe("Astron golden baseline (Legacy engine) — Sun sight", () => {
  beforeAll(() => {
    InitAstron();
    SetObservationData(GOLDEN_OBS);
  });

  it("GetReductionCorrections matches frozen baseline", () => {
    const r = GetReductionCorrections();
    expectClose(r.gha, 359.84405961128346, EPS, "gha");
    expectClose(r.chosenLongitude, -0.12, EPS, "chosenLongitude");
    expectClose(r.declination, 23.339201311244977, EPS, "declination");
    expectClose(r.lha, 359.72405961128345, EPS, "lha");
    expectClose(r.hc, 61.83839657638656, EPS, "hc");
    expectClose(r.azimuth, 179.4631654968273, EPS, "azimuth");
    expectClose(r.hs, 45.19663614366236, EPS, "hs");
    expectClose(GetGha(), r.gha, EPS, "GetGha vs row");
    expectClose(GetLha(), r.lha, EPS, "GetLha vs row");
    expectClose(GetHs(), r.hs, EPS, "GetHs vs row");
  });

  it("GetSextantCorrections matches frozen baseline", () => {
    const s = GetSextantCorrections();
    expectClose(s.refraction, -0.016146057165753586, EPS, "refraction");
    expectClose(s.sd, 0.2624195582533275, EPS, "sd");
    expectClose(s.parallax, 0.0011435513343229786, EPS, "parallax");
  });

  it("GetBestFitObjects: closest Hc to Hs, sorted ascending by difference", () => {
    const best = GetBestFitObjects(5);
    expect(best.length).toBeGreaterThanOrEqual(1);
    // Rank is by |Hc − Hs| over all tabulated bodies, not by selected object name.
    expect(best[0].name).toBe("Bellatrix");
    expectClose(best[0].difference, 0.37377912310913075, EPS, "top difference");
    for (let i = 1; i < best.length; i++) {
      expect(best[i].difference).toBeGreaterThanOrEqual(best[i - 1].difference);
    }
  });
});

describe("Astron golden baseline — Moon, delay, index error", () => {
  beforeAll(() => {
    InitAstron();
    SetObservationData(GOLDEN_OBS_MOON);
  });

  it("GetReductionCorrections matches frozen baseline", () => {
    const r = GetReductionCorrections();
    expectClose(r.gha, 53.00213348730685, EPS, "gha");
    expectClose(r.chosenLongitude, -3.7, EPS, "chosenLongitude");
    expectClose(r.declination, 8.337655149659279, EPS, "declination");
    expectClose(r.lha, 49.30213348730685, EPS, "lha");
    expectClose(r.hc, 35.8248610456903, EPS, "hc");
    expectClose(r.azimuth, 247.6955666546626, EPS, "azimuth");
    expectClose(r.hs, 53.10549308219632, EPS, "hs");
    expectClose(GetGha(), r.gha, EPS, "GetGha vs row");
    expectClose(GetLha(), r.lha, EPS, "GetLha vs row");
    expectClose(GetHs(), r.hs, EPS, "GetHs vs row");
  });

  it("GetSextantCorrections matches frozen baseline", () => {
    const s = GetSextantCorrections();
    expectClose(s.refraction, -0.012493538520927059, EPS, "refraction");
    expectClose(s.sd, 0.25284707072523105, EPS, "sd");
    expectClose(s.parallax, 0.7480644267491456, EPS, "parallax");
  });

  it("GetBestFitObjects: closest Hc to Hs, sorted ascending by difference", () => {
    const best = GetBestFitObjects(5);
    expect(best.length).toBeGreaterThanOrEqual(1);
    expect(best[0].name).toBe("Dubhe");
    expectClose(best[0].difference, 1.3693886482494904, EPS, "top difference");
    for (let i = 1; i < best.length; i++) {
      expect(best[i].difference).toBeGreaterThanOrEqual(best[i - 1].difference);
    }
  });
});
