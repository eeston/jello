export const spacing = {
  lg: 24,
  md: 16,
  sm: 12,
  xl: 32,
  xs: 8,
  xxl: 48,
  xxs: 4,
  xxxl: 64,
  xxxs: 2,
} as const;

export const shadow = {
  // https://ethercreative.github.io/react-native-shadow-generator/
  // level 10
  lg: {
    shadowColor: "#000",
    shadowOffset: {
      height: 5,
      width: 0,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
  },

  // https://ethercreative.github.io/react-native-shadow-generator/
  // level 5
  sm: {
    shadowColor: "#000",
    shadowOffset: {
      height: 2,
      width: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
} as const;

export const timing = {
  fast: 200,
  medium: 500,
  slow: 1000,
} as const;

export const symbol = {
  lg: 40,
  md: 32,
} as const;
