module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'import',
  ],
  extends: [
    'airbnb-typescript/base',
  ],
  parserOptions: {
    project: 'tsconfig.eslint.json',
  },
  ignorePatterns: ['*.js']
};
