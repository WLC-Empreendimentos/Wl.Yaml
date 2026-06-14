'use strict';

const tseslint = require('typescript-eslint');

module.exports = tseslint.config(
    // -------------------------------------------------------------------------
    // Ignorados — nunca lint em artefatos gerados ou legado
    // -------------------------------------------------------------------------
    {
        ignores: [
            'dist/**',
            'out/**',
            'coverage/**',
            '_old/**',
            'webpack.config.js',
            'eslint.config.js',
            'jest.config.js',
        ],
    },

    // -------------------------------------------------------------------------
    // Arquivos de produção: strict + type-checked (nível mais rigoroso)
    // -------------------------------------------------------------------------
    {
        files: ['src/**/*.ts'],
        extends: tseslint.configs.strictTypeChecked,
        languageOptions: {
            parserOptions: {
                project: true,
                tsconfigRootDir: __dirname,
            },
        },
        rules: {
            // Importações — obrigatório com verbatimModuleSyntax:true no tsconfig
            '@typescript-eslint/consistent-type-imports': ['error', {
                prefer: 'type-imports',
                fixStyle: 'inline-type-imports',
            }],
            '@typescript-eslint/consistent-type-exports': ['error', {
                fixMixedExportsWithInlineTypeSpecifier: true,
            }],

            // Tipagem explícita — CA: retorno declarado em toda função pública
            '@typescript-eslint/explicit-function-return-type': ['error', {
                allowExpressions: false,
                allowTypedFunctionExpressions: true,
                allowHigherOrderFunctions: false,
            }],
            '@typescript-eslint/explicit-module-boundary-types': 'error',

            // Imutabilidade
            '@typescript-eslint/prefer-readonly': 'error',

            // Variáveis não utilizadas — prefixo _ sinaliza descarte intencional
            '@typescript-eslint/no-unused-vars': ['error', {
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_',
                caughtErrorsIgnorePattern: '^_',
            }],

            // Preferências de estilo
            '@typescript-eslint/prefer-nullish-coalescing': 'error',
            '@typescript-eslint/prefer-optional-chain': 'error',
        },
    },

    // -------------------------------------------------------------------------
    // Arquivos de teste: strict + type-checked com tsconfig.test.json.
    // Regras de assinatura explícita ficam desligadas — callbacks anônimos
    // do Jest não precisam (e não devem) ter anotação de retorno.
    // -------------------------------------------------------------------------
    {
        files: ['tests/**/*.ts'],
        extends: tseslint.configs.strictTypeChecked,
        languageOptions: {
            parserOptions: {
                project: './tsconfig.test.json',
                tsconfigRootDir: __dirname,
            },
        },
        rules: {
            '@typescript-eslint/consistent-type-imports': ['error', {
                prefer: 'type-imports',
                fixStyle: 'inline-type-imports',
            }],
            '@typescript-eslint/no-unused-vars': ['error', {
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_',
                caughtErrorsIgnorePattern: '^_',
            }],
            '@typescript-eslint/prefer-nullish-coalescing': 'error',
            '@typescript-eslint/prefer-optional-chain': 'error',

            // Callbacks do Jest são anônimos — anotar retorno seria ruído
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
        },
    },
);
