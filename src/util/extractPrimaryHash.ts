import { BaseItemDtoImageBlurHashes } from "@jellyfin/sdk/lib/generated-client";

export const DEFAULT_BLUR_HASH = "L0FFsq%LfQ%L-;fQfQfQfQfQfQfQ";

export const extractPrimaryHash = (
  hash: BaseItemDtoImageBlurHashes | null | undefined,
): string => {
  const foundHash = Object.values(hash?.Primary ?? {})[0];
  if (foundHash) {
    return foundHash;
  } else {
    return DEFAULT_BLUR_HASH;
  }
};
