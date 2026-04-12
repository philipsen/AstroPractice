import { describe, expect, it } from "vitest";
import { formatAngleDegreesMinutes } from "./formatAngleDegreesMinutes";

describe("formatAngleDegreesMinutes", () => {
  it("formats unsigned angles with default width (legacy Degs_f DM.m)", () => {
    expect(formatAngleDegreesMinutes(74.61666666666666)).toBe("74° 37.0′");
    expect(formatAngleDegreesMinutes(0)).toBe("0° 00.0′");
    expect(formatAngleDegreesMinutes(-12.5)).toBe("-12° 30.0′");
  });

  it("applies N/S and E/W prefixes", () => {
    expect(formatAngleDegreesMinutes(51.5, "N")).toBe("N51° 30.0′");
    expect(formatAngleDegreesMinutes(-51.5, "N")).toBe("S51° 30.0′");
    expect(formatAngleDegreesMinutes(-3.7, "E")).toBe("W003° 42.0′");
  });

  it("supports almanac-style spacing without symbols", () => {
    expect(formatAngleDegreesMinutes(217.046666, "", 1, 1, true)).toBe(
      "217 02.8"
    );
  });
});
