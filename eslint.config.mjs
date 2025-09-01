// eslint.config.mjs
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'; // Import Prettier's recommended ESLint config
import withNuxt from './.nuxt/eslint.config.mjs'; // Import Nuxt's generated ESLint config

export default withNuxt(
  // You can pass additional flat config objects here.
  // eslintPluginPrettierRecommended contains both 'eslint-plugin-prettier' and 'eslint-config-prettier'.
  // It MUST be placed last to ensure it overrides any conflicting formatting rules.
  eslintPluginPrettierRecommended,
  {
    // Your custom linting rules go here.
    // Avoid setting formatting rules (like 'quotes', 'indent', 'semi') as Prettier handles them.
    rules: {
      // Example: Common Nuxt/Vue rules to customize
      'vue/multi-word-component-names': 'off', // Often disabled for Nuxt pages/layouts/components
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'vue/no-multiple-template-root': 'off',

      // 'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

      // You can add other Vue, TypeScript, or general ESLint linting rules
      // 'vue/no-unused-components': 'warn',
      // '@typescript-eslint/no-unused-vars': 'warn',
      // 'array-callback-return': 'error',
    },
  },
);
