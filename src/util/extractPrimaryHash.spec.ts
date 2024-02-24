import { extractPrimaryHash, DEFAULT_BLUR_HASH } from "./extractPrimaryHash";

describe("extractPrimaryHash", () => {
  it("should return the first hash value if it exists", () => {
    const hash = { Primary: { "1": "hash1", "2": "hash2" } };
    expect(extractPrimaryHash(hash)).toEqual("hash1");
  });

  it("should return the default hash if no hash values exist", () => {
    const hash = { Primary: {} };
    expect(extractPrimaryHash(hash)).toEqual(DEFAULT_BLUR_HASH);
  });

  it("should return the default hash if the hash object is undefined", () => {
    const hash = undefined;
    expect(extractPrimaryHash(hash)).toEqual(DEFAULT_BLUR_HASH);
  });
});
