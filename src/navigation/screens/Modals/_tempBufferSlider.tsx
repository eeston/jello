import Slider from "@react-native-community/slider";

const SHOW_BUFFER = false;

// temporary block of code to track buffer progress
export const TempBufferSlider = ({
  min,
  max,
  value,
}: {
  min: number;
  max: number;
  value: number;
}) => {
  if (!SHOW_BUFFER) {
    return null;
  }
  return (
    <Slider value={value} minimumValue={min} maximumValue={max} disabled />
  );
};
