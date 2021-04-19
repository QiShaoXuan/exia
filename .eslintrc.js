module.exports = {
  extends: 'eslint-config-ali/typescript/node',
  rules: {
    'no-empty': [2, { allowEmptyCatch: true }],
    'no-console': [0],
    '@typescript-eslint/no-require-imports': [0],
  },
};
