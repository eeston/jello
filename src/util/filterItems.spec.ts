import { filterItems } from "./filterItems";

describe("filterItems", () => {
  it("should filter items based on input", (done) => {
    const items = [{ Name: "Item 1" }, { Name: "Item 2" }, { Name: "Item 3" }];
    const setFilteredItemsList = jest.fn();

    const debouncedFilter = filterItems({ items, setFilteredItemsList });

    debouncedFilter("Item 1");

    setTimeout(() => {
      expect(setFilteredItemsList).toHaveBeenCalledWith([{ Name: "Item 1" }]);
      done();
    }, 200);
  });

  it("should ignore diacritics when filtering items", (done) => {
    const items = [{ Name: "Item 1" }, { Name: "Ítem 2" }, { Name: "Item 3" }];
    const setFilteredItemsList = jest.fn();

    const debouncedFilter = filterItems({ items, setFilteredItemsList });

    debouncedFilter("ítem 2");

    setTimeout(() => {
      expect(setFilteredItemsList).toHaveBeenCalledWith([{ Name: "Ítem 2" }]);
      done();
    }, 200);
  });

  it("should return all items if input is empty", (done) => {
    const items = [{ Name: "Item 1" }, { Name: "Item 2" }, { Name: "Item 3" }];
    const setFilteredItemsList = jest.fn();

    const debouncedFilter = filterItems({ items, setFilteredItemsList });

    debouncedFilter("");

    setTimeout(() => {
      expect(setFilteredItemsList).toHaveBeenCalledWith(items);
      done();
    }, 200);
  });

  it("should debounce the filtering", () => {
    jest.useFakeTimers();

    const items = [{ Name: "Item 1" }, { Name: "Item 2" }, { Name: "Item 3" }];
    const setFilteredItemsList = jest.fn();

    const debouncedFilter = filterItems({ items, setFilteredItemsList });

    debouncedFilter("Item 1");
    debouncedFilter("Item 2");

    jest.runAllTimers();

    expect(setFilteredItemsList).not.toHaveBeenCalledWith([{ Name: "Item 1" }]);
    expect(setFilteredItemsList).toHaveBeenCalledWith([{ Name: "Item 2" }]);
  });
});
