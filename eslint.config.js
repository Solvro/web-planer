// import { solvro } from "@solvro/config/eslint";
// export default solvro({
//   rules: {
//     "jsx-a11y/label-has-associated-control": [
//       "error",
//       {
//         labelComponents: ["Label"],
//         labelAttributes: ["label"],
//         controlComponents: ["Checkbox"],
//         depth: 3,
//       },
//     ],
//   },
// });
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import { defineConfig, globalIgnores } from "eslint/config";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
