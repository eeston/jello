import React, { ReactElement } from "react";
import {
  StyleProp,
  Pressable,
  PressableProps,
  View,
  ViewStyle,
} from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

interface ListItemProps extends PressableProps {
  height?: number;
  containerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  RightComponent?: ReactElement;
  LeftComponent?: ReactElement;
}

interface ListItemActionProps {
  Component?: ReactElement;
  size: number;
  side: "left" | "right";
}

export const ListItem = (props: ListItemProps) => {
  const { styles } = useStyles(stylesheet);
  const {
    height = 48,
    LeftComponent,
    RightComponent,
    style,
    containerStyle,
    ...PressableProps
  } = props;

  return (
    <View style={containerStyle}>
      <Pressable
        {...PressableProps}
        style={[styles.touchable, style, { height }]}
      >
        <ListItemFragment side="left" size={height} Component={LeftComponent} />
        <ListItemFragment
          side="right"
          size={height}
          Component={RightComponent}
        />
      </Pressable>
    </View>
  );
};

const ListItemFragment = ({ Component }: ListItemActionProps) => {
  return Component ?? null;
};

const stylesheet = createStyleSheet((theme) => ({
  touchable: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
}));
