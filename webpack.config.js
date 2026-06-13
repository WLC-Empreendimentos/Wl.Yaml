'use strict';

const path = require('path');

// Configuração base compartilhada pelos dois alvos.
// ts-loader opera com transpileOnly:true — a verificação de tipos fica por
// conta do job typecheck (tsc --noEmit), evitando duplicar trabalho no build.
/** @type {import('webpack').Configuration} */
const base = {
    devtool: 'source-map',
    resolve: {
        extensions: ['.ts', '.js'],
    },
    externals: {
        // vscode é injetado pelo host — nunca deve ser empacotado
        vscode: 'commonjs vscode',
    },
    infrastructureLogging: {
        level: 'log',
    },
};

// ---------------------------------------------------------------------------
// Alvo Node.js — extensão no host de extensão padrão (desktop)
// ---------------------------------------------------------------------------
/** @type {import('webpack').Configuration} */
const nodeConfig = {
    ...base,
    name: 'extension',
    target: 'node',
    entry: './src/extension.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'extension.js',
        libraryTarget: 'commonjs2',
        // Mapas de source apontam para src/ relativo ao dist/
        devtoolModuleFilenameTemplate: '../[resource-path]',
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                            configFile: 'tsconfig.node.json',
                        },
                    },
                ],
            },
        ],
    },
};

// ---------------------------------------------------------------------------
// Alvo Browser / WebWorker — extensão no host web (vscode.dev, github.dev)
// ---------------------------------------------------------------------------
/** @type {import('webpack').Configuration} */
const browserConfig = {
    ...base,
    name: 'extensionBrowser',
    target: 'webworker',
    entry: './src/extensionBrowser.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'extensionBrowser.js',
        libraryTarget: 'commonjs',
        devtoolModuleFilenameTemplate: '../[resource-path]',
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                            configFile: 'tsconfig.browser.json',
                        },
                    },
                ],
            },
        ],
    },
    resolve: {
        ...base.resolve,
        // Em ambiente webworker, prefere o campo "browser" do package.json
        mainFields: ['browser', 'module', 'main'],
        // Polyfills serão adicionados conforme a implementação exigir
        fallback: {},
    },
};

module.exports = [nodeConfig, browserConfig];
