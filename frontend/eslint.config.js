import js from "@eslint/js";
import globals from "globals";

import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

import reactPlugin from "eslint-plugin-react";
import functional from "eslint-plugin-functional";
import testingLibrary from "eslint-plugin-testing-library";
import importPlugin from "eslint-plugin-import";

import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist"]),

  {
    files: ["**/*.{js,jsx}"],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },

    settings: {
      react: { version: "detect" },
    },

    plugins: {
      react: reactPlugin,
      functional,
      "testing-library": testingLibrary,
      import: importPlugin,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },

    rules: {
      ...js.configs.recommended.rules,

      ...reactPlugin.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,

      ...reactRefresh.configs.recommended.rules,

      "import/extensions": "off",
      "import/no-unresolved": "off",

      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",

      "no-console": "off",

      "functional/no-conditional-statements": "off",
      "functional/no-expression-statements": "off",
      "functional/immutable-data": "off",
      "functional/functional-parameters": "off",
      "functional/no-try-statements": "off",
      "functional/no-throw-statements": "off",
      "functional/no-return-void": "off",

      "no-underscore-dangle": ["error", { allow: ["__filename", "__dirname"] }],

      "react/function-component-definition": [
        "error",
        { namedComponents: "arrow-function" },
      ],

      "testing-library/no-debug": "off",

      "react/jsx-filename-extension": ["warn", { extensions: [".js", ".jsx"] }],

      "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z_]" }],
    },
  },
]);
