import { useHeaderHeight } from "@react-navigation/elements";
import { View } from "react-native";

import { Separator } from "../Separator";

export const PlaylistFooter = () => {
  const headerHeight = useHeaderHeight();

  return (
    <View style={{ paddingBottom: headerHeight + 200 }}>
      <Separator marginLeft={20} />
    </View>
  );
};
