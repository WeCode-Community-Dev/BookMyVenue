// import js from "@eslint/js";
// import globals from "globals";
// import json from "@eslint/json";
// import { defineConfig } from "eslint/config";

// export default defineConfig([
//   { files: ["**/*.{js,mjs,cjs}"], plugins: { js }, extends: ["js/recommended"], languageOptions: { globals: globals.node } },
//   { files: ["**/*.json"], plugins: { json }, language: "json/json", extends: ["json/recommended"] },
// ]);

import js from "@eslint/js";
import globals from "globals";
import json from "@eslint/json";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: [
      "node_modules/**",
      ".env",
      "package-lock.json"
    ]
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.node
    },

    rules: {
      "no-unused-vars": "warn",
      "no-console": "off"
    }
  },

  {
    files: ["**/*.json"],
    plugins: { json },
    language: "json/json",
    extends: ["json/recommended"]
  }
]);
