import { Pressable } from "react-native";
import { SFSymbol } from "react-native-sfsymbols";

type PressableSFSymbolProps = {
  name: string;
  onPress: () => void;
  color: string;
  size: number;
  testID?: string;
  disabled?: boolean;
};

export const PressableSFSymbol = ({
  name,
  onPress,
  color,
  size,
  testID,
  disabled,
}: PressableSFSymbolProps) => {
  // const { styles } = useStyles(stylesheet);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1.0 }]}
      testID={testID}
      disabled={disabled}
    >
      <SFSymbol
        name={name}
        color={color}
        size={size}
        resizeMode="center"
        style={{ width: size, height: size }}
      />
    </Pressable>
  );
};

// const stylesheet = createStyleSheet((theme) => ({
//
// }));
