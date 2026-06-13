'use strict';

/** @type {import('jest').Config} */
module.exports = {
    testEnvironment: 'node',

    // Raízes e padrão de arquivos
    roots: ['<rootDir>/tests'],
    testMatch: ['**/*.test.ts'],
    passWithNoTests: true,
    // Integração roda via vscode-test, não via jest
    testPathIgnorePatterns: ['/node_modules/', '/tests/integracao/'],

    // ts-jest com module CommonJS — necessário para Node.js
    // verbatimModuleSyntax é desabilitado aqui: o tsconfig base exige import type
    // por consistência, mas ts-jest opera em CommonJS onde isso não se aplica
    transform: {
        '^.+\\.ts$': ['ts-jest', {
            tsconfig: {
                module: 'commonjs',
                verbatimModuleSyntax: false,
                types: ['jest', 'node'],
            },
        }],
    },

    // vscode não existe fora do host de extensão — substituído por stub
    moduleNameMapper: {
        '^vscode$': '<rootDir>/tests/__mocks__/vscode.ts',
    },

    // Cobertura
    collectCoverageFrom: [
        'src/**/*.ts',
        // Entry points são testados via integração (vscode-test), não via jest
        '!src/extension.ts',
        '!src/extensionBrowser.ts',
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html'],
    coverageThreshold: {
        global: {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100,
        },
    },

    // Isolamento entre testes
    clearMocks: true,
    restoreMocks: true,
};
