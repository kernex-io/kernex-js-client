module.exports = {
  env: {
    jest: true,
  },
  extends: [
    'airbnb-typescript/base',
  ],
  parserOptions: {
    project: './tsconfig.json',
  },
  plugins: ['import'],
};
