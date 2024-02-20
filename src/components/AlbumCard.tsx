import { Image } from "expo-image";
import { Pressable, Dimensions } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { Text } from "./Themed";

type AlbumCardProps = {
  title: string;
  subTitle: string | number;
  imageHash: string;
  imageUrl: string;
  onPress: () => void;
};

export const AlbumCard = ({
  title,
  subTitle,
  imageUrl,
  imageHash,
  onPress,
}: AlbumCardProps) => {
  const { styles } = useStyles(stylesheet);

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <Image
        style={styles.image}
        source={imageUrl}
        placeholder={imageHash}
        transition={300}
        recyclingKey={imageUrl}
      />

      <Text numberOfLines={1} style={styles.title}>
        {title}
      </Text>
      <Text numberOfLines={1} style={styles.subtitle}>
        {subTitle}
      </Text>
    </Pressable>
  );
};

const stylesheet = createStyleSheet((theme) => {
  const size = Dimensions.get("window").width / 2.4;
  return {
    container: {
      width: size,
    },
    image: {
      borderRadius: theme.spacing.xs,
      width: size,
      height: size,
    },
    title: {
      paddingTop: theme.spacing.xs,
    },
    subtitle: { color: theme.colors.textSecondary },
  };
});
