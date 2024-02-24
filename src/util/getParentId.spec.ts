import * as SecureStore from "expo-secure-store";

import { getParentId } from "./getParentId";

jest.mock("expo-secure-store");

describe("getParentId", () => {
  it("should return the id of the selected music library", async () => {
    const mockCollection = JSON.stringify({ id: "123" });
    (SecureStore.getItem as jest.Mock).mockReturnValue(mockCollection);

    const parentId = getParentId();
    expect(parentId).toEqual("123");
  });

  it("should return undefined if the selected music library is not set", async () => {
    (SecureStore.getItem as jest.Mock).mockReturnValue(null);

    const parentId = getParentId();
    expect(parentId).toBeUndefined();
  });

  it("should return undefined and log an error if parsing the collection fails", async () => {
    (SecureStore.getItem as jest.Mock).mockReturnValue("invalid json");

    const parentId = getParentId();
    expect(parentId).toBeUndefined();
  });
});
