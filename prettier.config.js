/** @type {import("prettier").Config} */
const config = {
  printWidth: 120,
  tabWidth: 2,
  plugins: [
    "prettier-plugin-svelte",
    "prettier-plugin-organize-imports",
    "prettier-plugin-tailwindcss",
  ],
  tailwindStylesheet: "./src/routes/layout.css",
  tailwindFunctions: ["clsx", "cn", "tv"],
  trailingComma: "all",
  experimentalTernaries: true,
  quoteProps: "consistent",
  objectWrap: "collapse",
  overrides: [
    {
      files: "*.svelte",
      options: {
        parser: "svelte",
      },
    },
  ],
};

export default config;
