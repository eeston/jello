import { shadow, spacing, symbol, timing } from "./common";

export default {
  colors: {
    background: "#ffffff", // white
    primary: "#000000", // black
    secondary: "#a9a9a9", // lightgrey
    tint: "#fc3c44", // red
    translucent: "rgba(0, 0, 0, 0.1)", // lightgrey transparent
  },
  shadow,
  spacing,
  symbol,
  timing,
} as const;
