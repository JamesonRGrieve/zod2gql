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
  '@typescript-eslint/consistent-type-exports': ['warn', { fixMixedExportsWithInlineTypeSpecifier: true }],
  '@typescript-eslint/no-import-type-side-effects': 'warn',
  '@typescript-eslint/method-signature-style': ['warn', 'property'],
  '@typescript-eslint/no-useless-empty-export': 'warn',
  '@typescript-eslint/no-non-null-assertion': 'warn',
  '@typescript-eslint/no-non-null-asserted-optional-chain': 'warn',
  '@typescript-eslint/no-confusing-non-null-assertion': 'warn',
  '@typescript-eslint/explicit-function-return-type': [
    'warn',
    { allowExpressions: true, allowTypedFunctionExpressions: true, allowHigherOrderFunctions: true },
  ],
  '@typescript-eslint/explicit-module-boundary-types': 'warn',
  '@typescript-eslint/ban-ts-comment': [
    'warn',
    {
      'ts-expect-error': 'allow-with-description',
      'ts-ignore': true,
      'ts-nocheck': true,
      minimumDescriptionLength: 5,
    },
  ],
  '@typescript-eslint/dot-notation': ['warn', { allowIndexSignaturePropertyAccess: true }],
  'dot-notation': 'off',

  '@typescript-eslint/no-unsafe-assignment': 'warn',
  '@typescript-eslint/no-unsafe-member-access': 'warn',
  '@typescript-eslint/no-unsafe-call': 'warn',
  '@typescript-eslint/no-unsafe-return': 'warn',
  '@typescript-eslint/no-unsafe-argument': 'warn',
  '@typescript-eslint/no-floating-promises': 'warn',
  '@typescript-eslint/no-misused-promises': 'warn',
  '@typescript-eslint/await-thenable': 'warn',
  '@typescript-eslint/require-await': 'warn',
  '@typescript-eslint/unbound-method': 'warn',
  '@typescript-eslint/no-base-to-string': 'warn',
  '@typescript-eslint/restrict-template-expressions': 'warn',
  '@typescript-eslint/restrict-plus-operands': 'warn',
  '@typescript-eslint/no-for-in-array': 'warn',
  '@typescript-eslint/no-unnecessary-condition': 'warn',
  '@typescript-eslint/strict-boolean-expressions': [
    'warn',
    {
      allowString: true,
      allowNumber: true,
      allowNullableObject: true,
      allowNullableBoolean: false,
      allowNullableString: false,
      allowNullableNumber: false,
      allowAny: false,
    },
  ],
  '@typescript-eslint/prefer-nullish-coalescing': ['warn', { ignorePrimitives: { string: true } }],
  '@typescript-eslint/prefer-optional-chain': 'warn',
  '@typescript-eslint/switch-exhaustiveness-check': 'warn',
  '@typescript-eslint/no-unsafe-enum-comparison': 'warn',
  '@typescript-eslint/no-unsafe-function-type': 'warn',
  '@typescript-eslint/no-unnecessary-type-arguments': 'warn',
  '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
  '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'warn',
  '@typescript-eslint/no-meaningless-void-operator': 'warn',
  '@typescript-eslint/no-mixed-enums': 'warn',
  '@typescript-eslint/no-duplicate-type-constituents': 'warn',
  '@typescript-eslint/no-redundant-type-constituents': 'warn',
  '@typescript-eslint/no-deprecated': 'warn',
  '@typescript-eslint/prefer-enum-initializers': 'warn',
  '@typescript-eslint/prefer-reduce-type-parameter': 'warn',
  '@typescript-eslint/prefer-return-this-type': 'warn',
  '@typescript-eslint/prefer-includes': 'warn',
  '@typescript-eslint/prefer-string-starts-ends-with': 'warn',
  '@typescript-eslint/prefer-find': 'warn',
  '@typescript-eslint/prefer-readonly': 'warn',
  '@typescript-eslint/require-array-sort-compare': ['warn', { ignoreStringArrays: true }],
  '@typescript-eslint/promise-function-async': 'warn',
  '@typescript-eslint/return-await': ['warn', 'in-try-catch'],

  'no-shadow': 'off',
  '@typescript-eslint/no-shadow': ['warn', { builtinGlobals: false, hoist: 'all' }],
  'no-self-compare': 'warn',
  'no-template-curly-in-string': 'warn',
  'no-unreachable-loop': 'warn',
  'no-new-func': 'warn',
  'no-useless-concat': 'warn',
  'no-useless-return': 'warn',
  'no-lonely-if': 'warn',
  'no-unneeded-ternary': 'warn',
  'no-loss-of-precision': 'warn',
  'no-constant-binary-expression': 'warn',
  'no-await-in-loop': 'warn',
  'no-promise-executor-return': 'warn',
  'require-atomic-updates': 'warn',
  'array-callback-return': 'warn',
  'no-constructor-return': 'warn',
  'default-case-last': 'warn',
  'grouped-accessor-pairs': 'warn',
  'prefer-arrow-callback': ['warn', { allowNamedFunctions: true }],
  'prefer-rest-params': 'warn',
  'no-console': ['warn', { allow: ['warn', 'error'] }],
  'no-debugger': 'warn',
  'no-param-reassign': ['warn', { props: false }],
  'consistent-return': 'warn',

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
  'import/no-cycle': ['warn', { maxDepth: 4, ignoreExternal: true }],
  'import/no-self-import': 'warn',
  'import/no-useless-path-segments': 'warn',
  'import/first': 'warn',

  complexity: ['warn', 25],
  'max-depth': ['warn', 5],

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
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/unbound-method': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },
];
