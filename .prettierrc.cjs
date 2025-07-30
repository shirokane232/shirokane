/** @type {import("prettier").Config} */
const config = {
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 100,
  tabWidth: 2,
  vueIndentScriptAndStyle: true,
  plugins: ['prettier-plugin-organize-imports', 'prettier-plugin-tailwindcss'],
};

module.exports = config;
