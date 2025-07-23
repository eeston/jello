module.exports = function (api) {
  api.cache(true);
  return {
    plugins: [
      "react-native-reanimated/plugin",
      [
        "react-native-unistyles/plugin",
        {
          // pass root folder of your application
          // all files under this folder will be processed by the Babel plugin
          // if you need to include more folders, or customize discovery process
          // check available babel options
          root: "src",
        },
      ],
    ],
    presets: [["babel-preset-expo", { unstable_transformImportMeta: true }]], // https://github.com/pmndrs/zustand/discussions/1967
  };
};
