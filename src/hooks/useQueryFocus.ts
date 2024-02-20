import { useFocusEffect } from "@react-navigation/native";
import { focusManager } from "@tanstack/react-query";
import { useCallback } from "react";

export const useQueryFocus = () => {
  useFocusEffect(
    useCallback(() => {
      focusManager.setFocused(true);
      return () => {
        focusManager.setFocused(false);
      };
    }, []),
  );
};
