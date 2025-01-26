module.exports = {
  extends: [
    "universe/native",
    "universe/shared/typescript-analysis",
    "plugin:perfectionist/recommended-natural",
  ],
  overrides: [
    {
      files: ["*.ts", "*.tsx", "*.d.ts"],
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
  ],
  plugins: ["eslint-plugin-react-compiler"],
  root: true,
  rules: {
    "react-compiler/react-compiler": "error",
  },
};
