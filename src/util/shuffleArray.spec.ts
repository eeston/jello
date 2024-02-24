import { shuffleArray } from "./shuffleArray";

describe("shuffleArray", () => {
  it("should return a new array with the same length", () => {
    const array = [1, 2, 3, 4, 5];
    const shuffled = shuffleArray(array);
    expect(shuffled).toHaveLength(array.length);
  });

  it("should contain all the elements of the original array", () => {
    const array = [1, 2, 3, 4, 5];
    const shuffled = shuffleArray(array);
    array.forEach((item) => {
      expect(shuffled).toContain(item);
    });
  });

  it("should not mutate the original array", () => {
    const array = [1, 2, 3, 4, 5];
    const copy = [...array];
    shuffleArray(array);
    expect(array).toEqual(copy);
  });
});
