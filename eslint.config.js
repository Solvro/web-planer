import { solvro } from "@solvro/config/eslint";

export default solvro({
  rules: {
    "jsx-a11y/label-has-associated-control": [
      "error",
      {
        labelComponents: ["Label"],
        labelAttributes: ["label"],
        controlComponents: ["Checkbox"],
        depth: 3,
      },
    ],
  },
});
