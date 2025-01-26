import { describe, expect, test } from "vitest";

import {
  secondsToMmSs,
  secondsToTicks,
  ticksToMins,
  ticksToSeconds,
} from "./time";

describe("time", () => {
  describe("secondsToTicks", () => {
    test("should convert seconds to ticks", () => {
      expect(secondsToTicks(1)).toEqual(10000000);
    });

    test("should return 0 for invalid input", () => {
      expect(secondsToTicks("invalid")).toEqual(0);
      expect(secondsToTicks(NaN)).toEqual(0);
    });
  });

  describe("ticksToSeconds", () => {
    test("should convert ticks to seconds", () => {
      expect(ticksToSeconds(10000000)).toEqual(1);
    });

    test("should return 0 for invalid input", () => {
      expect(ticksToSeconds("invalid")).toEqual(0);
      expect(ticksToSeconds(NaN)).toEqual(0);
    });
  });

  describe("ticksToMins", () => {
    test("should convert ticks to minutes", () => {
      expect(ticksToMins(600000000)).toEqual(1);
    });
  });

  describe("secondsToMmSs", () => {
    test("should format seconds as mm:ss", () => {
      expect(secondsToMmSs(90)).toEqual("1:30");
    });

    test('should return "0:00" for invalid input', () => {
      expect(secondsToMmSs("invalid")).toEqual("0:00");
      expect(secondsToMmSs(NaN)).toEqual("0:00");
      expect(secondsToMmSs(0)).toEqual("0:00");
    });
  });
});
