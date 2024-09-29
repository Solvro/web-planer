module.exports = {
  extends: [
    "@alergeek-ventures/eslint-config/typescript",
    "@alergeek-ventures/eslint-config/react",
    "plugin:@next/next/recommended",
  ],
  ignorePatterns: ["lint-staged.config.mjs", "next.config.mjs", "public/**"],
  parser: "@typescript-eslint/parser",
  root: true,
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json"],
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    "simple-import-sort/imports": "off",
    "simple-import-sort/exports": "off",
    "@typescript-eslint/no-magic-numbers": "off",
    "jsx-a11y/label-has-associated-control": [
      2,
      {
        controlComponents: ["Checkbox"],
        depth: 3,
      },
    ],
  },
  overrides: [
    {
      files: ["src/pages/**/*", "src/app/**/*"],
      rules: {
        "import/no-default-export": "off",
      },
    },
  ],
};
