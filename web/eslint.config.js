// eslint.config.js
import js from "@eslint/js";
import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import importPlugin from "eslint-plugin-import";

export default [
  js.configs.recommended,
  {
    ignores: ["node_modules", "dist"],
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      sourceType: "module",
      parserOptions: {
        project: "./tsconfig.json", // 🔥 Indique à ESLint où trouver la config TypeScript
        tsconfigRootDir: process.cwd(), // 🔥 Résout les erreurs liées au chemin
        ecmaVersion: 2020, // 🔥 Assure que ESLint fonctionne avec ES2020
      },
    },
    env: {
      browser: true, // 🔥 Indique qu'on est dans un navigateur (document, window, etc.)
      node: true,    // 🔥 Indique qu'on peut utiliser console, process, etc.
    },
    plugins: {
      "@typescript-eslint": ts,
      react,
      "react-hooks": reactHooks,
      "import": importPlugin
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "no-undef": "off", // 🔥 Désactive les erreurs sur console, window, document, etc.
      "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      "@typescript-eslint/no-unsafe-member-access": "off", // 🔥 Désactive les erreurs sur les accès dynamiques
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-extra-non-null-assertion": "warn",
      "@typescript-eslint/no-unnecessary-type-assertion": "warn",
      "@typescript-eslint/strict-boolean-expressions": "off", // 🔥 Désactive les erreurs inutiles sur les booléens
      "@typescript-eslint/ban-ts-comment": "off", // Autorise les `@ts-ignore`
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }], // Ignore les variables inutilisées avec `_`
       /** 🔥 Assouplissement des règles React */
      "react/react-in-jsx-scope": "off", // Plus besoin d'importer React dans les fichiers JSX (React 17+)
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "import/order": "off", // 🔥 Désactive la règle si elle pose problème
    },
  },
];
