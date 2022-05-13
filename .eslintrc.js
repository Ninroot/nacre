module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'import',
  ],
  extends: [
    'airbnb-typescript/base',
    'prettier', // keep prettier last to override other configs
  ],
  parserOptions: {
    project: 'tsconfig.eslint.json',
  },
  ignorePatterns: ['*.js']
};
