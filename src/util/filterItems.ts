import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client";
import { debounce } from "lodash";

type FilterItemsType = {
  items: BaseItemDto[];
  setFilteredItemsList: (items: BaseItemDto[]) => void;
};

export const filterItems = ({
  items,
  setFilteredItemsList,
}: FilterItemsType) => {
  return debounce((textInput: string) => {
    const lowerCaseInput = textInput
      ?.normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase();

    if (!lowerCaseInput.length) {
      setFilteredItemsList(items);
      return;
    }

    const filteredItemsList = items?.filter((item) => {
      const lowerCaseName = item?.Name?.normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase();
      return lowerCaseName?.includes(lowerCaseInput);
    });

    setFilteredItemsList(filteredItemsList);
  }, 100);
};
