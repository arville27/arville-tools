/** @type {import("prettier").Config} */
module.exports = {
  printWidth: 90,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  quoteProps: 'consistent',
  jsxSingleQuote: true,
  trailingComma: 'es5',
  bracketSpacing: true,
  bracketSameLine: true,
  arrowParens: 'always',
  singleAttributePerLine: false,
  plugins: [require.resolve('prettier-plugin-tailwindcss')],
};
