import { fetchRadioInfo, useFetchRadioMetadata } from "@src/api/radio";
import { ThemedText } from "@src/components/ThemedText";
import axios from "axios";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { SymbolView } from "expo-symbols";
import { FlatList, Pressable, View } from "react-native";
import TrackPlayer, { TrackType } from "react-native-track-player";
import { createStyleSheet, useStyles } from "react-native-unistyles";

// TODO: this will most likely change
const RADIO_STREAMS = [
  {
    artworkUrl:
      "https://www.chilltrax.com/images/specialty/default-album-cover.png",
    description: "The worlds chillout channel",
    fetchTrackArtworkUrl: "https://www.chilltrax.com/php/GetCoverImageNew.php",
    fetchTrackDetailsUrl:
      "https://www.chilltrax.com/php/GetSongInformationNew.php",
    streamUrl: "https://streamssl.chilltrax.com/index.html",
    title: "Chilltrax",
  },
];

export default function Radio() {
  const { styles } = useStyles(stylesheet);

  const renderItem = ({ item }) => {
    const handleOnPressRadio = async () => {
      const radioData = await fetchRadioInfo({
        trackArtworkUrl: item.fetchTrackArtworkUrl,
        trackDetailsUrl: item.fetchTrackDetailsUrl,
      });

      TrackPlayer.reset();
      TrackPlayer.add([
        {
          artist: radioData.trackDetails.artist,
          artwork: radioData.artwork.cover.replace(/300/g, "1000"),
          isLiveStream: true,
          title: radioData.trackDetails.title,
          type: TrackType.HLS,
          url: item.streamUrl,
        },
      ]);
      TrackPlayer.play();
    };
    return (
      <Pressable onPress={handleOnPressRadio} style={styles.radioContainer}>
        <Image source={item.artworkUrl} style={styles.radioArtwork} />
        <BlurView style={styles.blurContainer} tint="dark">
          <View style={styles.radioDetails}>
            <View>
              <ThemedText
                ellipsizeMode="tail"
                numberOfLines={1}
                style={styles.text}
                type="subtitle"
              >
                {item.title}
              </ThemedText>
              <ThemedText
                ellipsizeMode="tail"
                numberOfLines={1}
                style={styles.text}
                type="default"
              >
                {item.description}
              </ThemedText>
            </View>
            <SymbolView
              name="play.fill"
              resizeMode="scaleAspectFit"
              tintColor="white"
            />
          </View>
        </BlurView>
      </Pressable>
    );
  };

  return (
    <FlatList
      ItemSeparatorComponent={() => <View style={styles.seperator} />}
      contentContainerStyle={styles.container}
      contentInsetAdjustmentBehavior="automatic"
      data={RADIO_STREAMS}
      renderItem={renderItem}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
    />
  );
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  blurContainer: {
    bottom: 0,
    left: 0,
    padding: 16,
    position: "absolute",
    right: 0,
  },
  container: {
    paddingBottom: theme.spacing.xxxl,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
  },
  radioArtwork: {
    height: runtime.screen.width - theme.spacing.md * 2,
  },
  radioContainer: {
    borderRadius: theme.spacing.md,
    overflow: "hidden",
    position: "relative",
  },
  radioDetails: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  seperator: {
    padding: theme.spacing.md,
  },
  text: {
    color: "white",
  },
}));
