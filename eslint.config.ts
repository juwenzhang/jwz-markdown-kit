import type { Linter } from 'eslint';
import typescriptParser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';

const config: Linter.FlatConfig[] = [
  {
    languageOptions: {
      ecmaVersion: 12,
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
      },
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      react: reactPlugin
    },
    rules: {
      'no-console': 'off',
      'no-debugger': 'off',
      ...reactPlugin.configs.recommended.rules
    },
    settings: {
      react: {
        version: 'detect'
      }
    }
  }
];

export default config;