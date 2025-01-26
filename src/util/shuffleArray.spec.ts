import { describe, expect, test } from "vitest";

import { shuffleArray } from "./shuffleArray";

describe("shuffleArray", () => {
  test("should return a new array with the same length", () => {
    const array = [1, 2, 3, 4, 5];
    const shuffled = shuffleArray(array);
    expect(shuffled).toHaveLength(array.length);
  });

  test("should contain all the elements of the original array", () => {
    const array = [1, 2, 3, 4, 5];
    const shuffled = shuffleArray(array);
    array.forEach((item) => {
      expect(shuffled).toContain(item);
    });
  });

  test("should not mutate the original array", () => {
    const array = [1, 2, 3, 4, 5];
    const copy = [...array];
    shuffleArray(array);
    expect(array).toEqual(copy);
  });
});
