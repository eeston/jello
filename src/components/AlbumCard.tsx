import { ThemedText } from "@src/components/ThemedText";
import { Image } from "expo-image";
import { Pressable, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

type AlbumCardProps = {
  imageHash: string;
  imageUrl: string;
  large?: boolean;
  /**
   * Not actually required if we use `<Link />` from `expo-router` and set the `asChild` prop
   */
  onPress?: () => void;
  subTitle: number | string;
  title: string;
};

export enum AlbumCardSize {
  large = 300,
  small = 160,
}

export const AlbumCard = ({
  imageHash,
  imageUrl,
  large,
  onPress,
  subTitle,
  title,
}: AlbumCardProps) => {
  const { styles, theme } = useStyles(stylesheet);
  return (
    <Pressable onPress={onPress} style={styles.container(large)}>
      <Image
        contentFit="fill"
        placeholder={{ blurhash: imageHash }}
        recyclingKey={imageUrl}
        source={imageUrl}
        style={styles.image(large)}
        transition={theme.timing.medium}
      />

      <View style={styles.textContainer}>
        <ThemedText numberOfLines={1} type="defaultSemiBold">
          {title}
        </ThemedText>
        <ThemedText numberOfLines={1} style={styles.subtitle} type="default">
          {subTitle}
        </ThemedText>
      </View>
    </Pressable>
  );
};

const stylesheet = createStyleSheet((theme) => {
  return {
    container: (large) => ({
      width: large ? 300 : 160,
    }),
    image: (large) => ({
      borderRadius: theme.spacing.xs,
      height: large ? 300 : 160,
      width: large ? 300 : 160,
    }),
    subtitle: {
      color: theme.colors.secondary,
      fontSize: 14,
      lineHeight: 14,
    },
    textContainer: {
      paddingBottom: theme.spacing.xxs,
      paddingTop: theme.spacing.xxxs,
    },
  };
});
