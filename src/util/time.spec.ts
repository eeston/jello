import {
  secondsToTicks,
  ticksToSeconds,
  ticksToMins,
  secondsToMmSs,
} from "./time";

describe("time", () => {
  describe("secondsToTicks", () => {
    it("should convert seconds to ticks", () => {
      expect(secondsToTicks(1)).toEqual(10000000);
    });

    it("should return 0 for invalid input", () => {
      expect(secondsToTicks("invalid")).toEqual(0);
      expect(secondsToTicks(NaN)).toEqual(0);
    });
  });

  describe("ticksToSeconds", () => {
    it("should convert ticks to seconds", () => {
      expect(ticksToSeconds(10000000)).toEqual(1);
    });

    it("should return 0 for invalid input", () => {
      expect(ticksToSeconds("invalid")).toEqual(0);
      expect(ticksToSeconds(NaN)).toEqual(0);
    });
  });

  describe("ticksToMins", () => {
    it("should convert ticks to minutes", () => {
      expect(ticksToMins(600000000)).toEqual(1);
    });
  });

  describe("secondsToMmSs", () => {
    it("should format seconds as mm:ss", () => {
      expect(secondsToMmSs(90)).toEqual("1:30");
    });

    it('should return "0:00" for invalid input', () => {
      expect(secondsToMmSs("invalid")).toEqual("0:00");
      expect(secondsToMmSs(NaN)).toEqual("0:00");
      expect(secondsToMmSs(0)).toEqual("0:00");
    });
  });
});
