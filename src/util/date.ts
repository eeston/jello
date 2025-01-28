import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client";
import { format, parseISO } from "date-fns";

export const fmtIsoDate = (
  isoDate?: BaseItemDto["DateCreated"],
): null | string => {
  if (!isoDate) {
    return null;
  }

  try {
    return format(parseISO(isoDate), "d MMMM yyyy");
  } catch (error) {
    return null;
  }
};

export const fmtIsoYear = (
  isoDate?: BaseItemDto["PremiereDate"],
): null | string => {
  if (!isoDate) {
    return null;
  }

  try {
    return format(parseISO(isoDate), "yyyy");
  } catch (error) {
    return null;
  }
};
