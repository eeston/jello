module.exports = {
  root: true,
  extends: ["universe/native", "universe/shared/typescript-analysis"],
  overrides: [
    {
      files: ["*.ts", "*.tsx", "*.d.ts"],
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
  ],
  plugins: ["eslint-plugin-react-compiler"],
  rules: {
    "react-compiler/react-compiler": "error",
  },
};
