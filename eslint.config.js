import expoConfig from "eslint-config-expo/flat.js";
import perfectionist from "eslint-plugin-perfectionist";
import reactCompiler from "eslint-plugin-react-compiler";
import { defineConfig } from "eslint/config";

export default defineConfig([
  expoConfig,
  perfectionist.configs["recommended-natural"],
  {
    ignores: ["dist/*"],
    plugins: { "react-compiler": reactCompiler },
    rules: {
      "react-compiler/react-compiler": "error",
    },
  },
]);
