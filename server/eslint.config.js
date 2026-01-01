import js from "@eslint/js";
import globals from "globals";
import promisePlugin from "eslint-plugin-promise";
import securityPlugin from "eslint-plugin-security";
import nPlugin from "eslint-plugin-n";

export default [
  js.configs.recommended,
  promisePlugin.configs["flat/recommended"],
  securityPlugin.configs.recommended,
  nPlugin.configs["flat/recommended"],
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node, // Changed from browser to node for MERN backend
      },
    },
    plugins: {
      promise: promisePlugin,
      security: securityPlugin,
      n: nPlugin,
    },
    rules: {
      "no-console": "warn",
      "no-unused-vars": "error",
      "promise/always-return": "error",
      "security/detect-object-injection": "warn",
      "n/no-process-exit": "off", // We use process.exit(1) in dbConnect, so we turn this off
    },
  },
];