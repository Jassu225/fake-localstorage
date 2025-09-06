module.exports = {
  parser: "@typescript-eslint/parser",
  extends: ["eslint:recommended"],
  plugins: ["@typescript-eslint"],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
  rules: {
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-non-null-assertion": "warn",
    "prefer-const": "error",
    "no-var": "error",
    "no-undef": "off", // TypeScript handles this
  },
  env: {
    node: true,
    es6: true,
    jest: true,
    browser: true,
  },
  globals: {
    global: "readonly",
    globalThis: "readonly",
    window: "readonly",
    Storage: "readonly",
    StorageEvent: "readonly",
  },
};
