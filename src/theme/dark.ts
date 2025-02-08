import { shadow, spacing, symbol, timing } from "./common";

export default {
  colors: {
    background: "#000000", // black
    primary: "#ffffff", // white
    secondary: "#808080", // darkgrey
    tint: "#f94c57", // red
    translucent: "rgba(255, 255, 255, 0.1)", // lightgrey transparent
  },
  shadow,
  spacing,
  symbol,
  timing,
} as const;
