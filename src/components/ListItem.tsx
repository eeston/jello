import React, { ReactElement } from "react";
import {
  Pressable,
  PressableProps,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";
import { StyleSheet } from "react-native-unistyles";

interface ListItemActionProps {
  Component?: ReactElement;
  side: "left" | "right";
  size: number;
}

interface ListItemProps extends PressableProps {
  containerStyle?: StyleProp<ViewStyle>;
  height?: number;
  LeftComponent?: ReactElement;
  RightComponent?: ReactElement;
  style?: StyleProp<ViewStyle>;
}

export const ListItem = (props: ListItemProps) => {
  const {
    containerStyle,
    height = 48,
    LeftComponent,
    RightComponent,
    style,
    ...PressableProps
  } = props;

  return (
    <View style={containerStyle}>
      <Pressable
        {...PressableProps}
        style={({ pressed }) => [
          styles.touchable,
          style,
          { height },
          { opacity: pressed ? 0.5 : 1 },
        ]}
      >
        <ListItemFragment Component={LeftComponent} side="left" size={height} />
        <ListItemFragment
          Component={RightComponent}
          side="right"
          size={height}
        />
      </Pressable>
    </View>
  );
};

const ListItemFragment = ({ Component }: ListItemActionProps) => {
  return Component ?? null;
};

const styles = StyleSheet.create((theme) => ({
  touchable: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
}));
