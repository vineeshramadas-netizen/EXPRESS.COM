module.exports = {
  root: true,
  env: { node: true, es2021: true, browser: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'prettier'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'jsx-a11y', 'import'],
  settings: { react: { version: 'detect' } },
  ignorePatterns: ['dist', 'node_modules', 'coverage'],
  rules: {
    'react/react-in-jsx-scope': 'off'
  }
};
