const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "scratch/**",
      ".wwebjs_auth/**",
      ".wwebjs_cache/**",
      "playwright-report/**",
      "test-results/**",
      "public/assets/**",
      "**/dist/**",
      "**/build/**"
    ]
  },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021
      }
    },
    rules: {
      "no-unused-vars": ["warn", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
      "no-undef": "off",
      "no-console": "off",
      "no-empty": "off",
      "no-useless-assignment": "off",
      "semi": ["error", "always"]
    }
  }
];
