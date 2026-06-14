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

    transform: {
        '^.+\\.ts$': ['ts-jest', {
            tsconfig: './tsconfig.test.json',
        }],
    },

    // vscode e vscode-languageclient não existem fora do host de extensão — substituídos por stubs
    moduleNameMapper: {
        '^vscode$': '<rootDir>/tests/__mocks__/vscode.ts',
        '^vscode-languageclient(/.*)?$': '<rootDir>/tests/__mocks__/vscode-languageclient.ts',
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
