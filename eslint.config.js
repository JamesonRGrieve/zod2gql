import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import globals from 'globals';

const sharedRules = {
  ...js.configs.recommended.rules,
  ...tseslint.configs.recommended.rules,

  '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
  '@typescript-eslint/no-explicit-any': 'warn',
  '@typescript-eslint/consistent-type-imports': ['warn', { prefer: 'type-imports' }],
  '@typescript-eslint/no-non-null-assertion': 'warn',
  '@typescript-eslint/explicit-function-return-type': [
    'warn',
    { allowExpressions: true, allowTypedFunctionExpressions: true, allowHigherOrderFunctions: true },
  ],
  '@typescript-eslint/explicit-module-boundary-types': 'warn',
  '@typescript-eslint/ban-ts-comment': [
    'warn',
    { 'ts-expect-error': 'allow-with-description', 'ts-ignore': true, minimumDescriptionLength: 5 },
  ],

  'no-restricted-syntax': [
    'warn',
    {
      selector: "TSAsExpression > TSTypeReference[typeName.name='Record'] > TSTypeParameterInstantiation > TSAnyKeyword",
      message:
        'Avoid `as Record<string, any>`. Type the value precisely; use `Record<string, unknown>` only at framework boundaries.',
    },
    {
      selector: 'TSAsExpression > TSUnknownKeyword',
      message: 'Avoid `as unknown` to bypass type errors. Validate at the boundary and propagate the narrow type.',
    },
    {
      selector: "TSAsExpression[typeAnnotation.type='TSAnyKeyword']",
      message: 'Avoid `as any`. Fix the type at its source.',
    },
  ],

  'import/order': [
    'warn',
    {
      groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
      'newlines-between': 'never',
      alphabetize: { order: 'asc' },
    },
  ],
  'import/newline-after-import': 'warn',
  'import/no-duplicates': 'warn',

  eqeqeq: ['warn', 'always'],
  curly: ['warn', 'all'],
  'prefer-template': 'warn',
  'prefer-const': 'warn',
  'no-var': 'warn',
  'no-eval': 'error',
  'no-implied-eval': 'error',
  'no-throw-literal': 'warn',

  ...prettierConfig.rules,
  'prettier/prettier': [
    'warn',
    {
      printWidth: 125,
      tabWidth: 2,
      useTabs: false,
      semi: true,
      singleQuote: true,
      quoteProps: 'as-needed',
      trailingComma: 'all',
      bracketSpacing: true,
      arrowParens: 'always',
      endOfLine: 'lf',
    },
  ],
};

export default [
  {
    ignores: ['dist/', 'node_modules/', 'docs/', 'scripts/', '*.config.js', '*.config.mjs'],
  },
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      import: importPlugin,
      prettier: prettierPlugin,
    },
    settings: {
      'import/resolver': {
        typescript: { project: './tsconfig.json' },
      },
    },
    rules: sharedRules,
  },
  {
    files: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
];
