import tseslint from 'typescript-eslint';
import astroPlugin from 'eslint-plugin-astro';

export default tseslint.config(
  { ignores: ['dist/', '.astro/', 'src/env.d.ts'] },
  ...astroPlugin.configs['flat/recommended'],
  {
    files: ['src/**/*.{ts,tsx}'],
    extends: [...tseslint.configs.strict],
    languageOptions: {
      parserOptions: { project: './tsconfig.json' },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-assertions': ['error', {
        assertionStyle: 'never',
      }],
      '@typescript-eslint/no-unused-vars': ['error', {
        ignoreRestSiblings: true,
      }],
    },
  },
);
