import React, { ReactElement } from "react";
import {
  StyleProp,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

interface ListItemProps extends TouchableOpacityProps {
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
    ...TouchableOpacityProps
  } = props;

  return (
    <View style={containerStyle}>
      <TouchableOpacity
        {...TouchableOpacityProps}
        style={[styles.touchable, style, { height }]}
      >
        <ListItemFragment side="left" size={height} Component={LeftComponent} />
        <ListItemFragment
          side="right"
          size={height}
          Component={RightComponent}
        />
      </TouchableOpacity>
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
