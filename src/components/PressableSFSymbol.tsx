import { Pressable } from "react-native";
import { SFSymbol } from "react-native-sfsymbols";

type PressableSFSymbolProps = {
  name: string;
  onPress: () => void;
  color: string;
  size: number;
};

export const PressableSFSymbol = ({
  name,
  onPress,
  color,
  size,
}: PressableSFSymbolProps) => {
  // const { styles } = useStyles(stylesheet);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1.0 }]}
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
