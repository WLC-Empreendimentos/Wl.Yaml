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
    // Base: strict + type-checked (o nível mais rigoroso do typescript-eslint)
    // -------------------------------------------------------------------------
    ...tseslint.configs.strictTypeChecked,

    // -------------------------------------------------------------------------
    // Configuração do parser e regras adicionais
    // -------------------------------------------------------------------------
    {
        files: ['src/**/*.ts'],
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
);
