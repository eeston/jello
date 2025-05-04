module.exports = function (api) {
  api.cache(true);
  return {
    plugins: ["react-native-reanimated/plugin"],
    presets: [["babel-preset-expo", { unstable_transformImportMeta: true }]], // https://github.com/pmndrs/zustand/discussions/1967
  };
};
