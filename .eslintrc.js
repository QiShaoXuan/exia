module.exports = {
  rules: {
    'no-empty': [2, { allowEmptyCatch: true }],
    'no-console': [0],
    '@typescript-eslint/no-require-imports': [0],
  },
  extends: ['eslint-config-ali/node', 'prettier'],
};
