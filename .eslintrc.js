/* eslint-env node */

module.exports = {
  root: true,
  extends: [
    'plugin:@shopify/typescript',
    'plugin:@shopify/react',
    'plugin:@shopify/prettier',
    'plugin:@shopify/polaris',
    'plugin:@shopify/webpack',
    'plugin:@shopify/jest',
  ],
  settings: {
    react: {
      version: 'detect',
    },
    'import/external-module-folders': ['node_modules', 'packages'],
  },
};
