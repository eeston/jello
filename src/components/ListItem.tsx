import React, { ReactElement } from "react";
import {
  Pressable,
  PressableProps,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

interface ListItemActionProps {
  Component?: ReactElement;
  side: "left" | "right";
  size: number;
}

interface ListItemProps extends PressableProps {
  LeftComponent?: ReactElement;
  RightComponent?: ReactElement;
  containerStyle?: StyleProp<ViewStyle>;
  height?: number;
  style?: StyleProp<ViewStyle>;
}

export const ListItem = (props: ListItemProps) => {
  const { styles } = useStyles(stylesheet);
  const {
    LeftComponent,
    RightComponent,
    containerStyle,
    height = 48,
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

const stylesheet = createStyleSheet((theme) => ({
  touchable: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
}));
