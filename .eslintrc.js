module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
  },
  ignorePatterns: ['**/*.d.ts'],
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    'no-unused-vars': 0,
    'import/no-unresolved': 0,
    'import/extensions': 0,
    'import/named': 0,
    'import/prefer-default-export': 0,
    'no-underscore-dangle': 0,
    'no-restricted-syntax': 0,
    'class-methods-use-this': 0,
  },
};
