/**
 * Stub manual do módulo `vscode` para testes unitários com Jest.
 *
 * @remarks
 * O VS Code não existe fora do host de extensão. Este arquivo é mapeado
 * via `moduleNameMapper` no jest.config.js e intercepta todo `import 'vscode'`
 * durante os testes. Cada teste que precisa controlar configurações deve
 * importar `__vscodeMock` e chamar seus métodos no `beforeEach`/`afterEach`.
 */

const _configuracoes = new Map<string, unknown>();
const _arquivos = new Map<string, Uint8Array>();
const _errosFs = new Map<string, Error>();

class ConfiguracaoVsCodeMock {
    constructor(private readonly _secao?: string) {}

    get(chave: string, padrao?: unknown): unknown {
        const chaveCompleta = this._secao !== undefined ? `${this._secao}.${chave}` : chave;
        const valor = _configuracoes.get(chaveCompleta);
        return valor !== undefined ? valor : padrao;
    }
}

class UriMock {
    constructor(
        readonly scheme: string,
        readonly path: string,
    ) {}

    toString(): string {
        return `${this.scheme}://${this.path}`;
    }
}

/** Utilitários de controle do stub — usados exclusivamente nos testes. */
export const __vscodeMock = {
    /**
     * Define o valor de uma configuração para o próximo teste.
     *
     * @param secao - Seção da configuração (ex: `'yaml'`, `'editor'`).
     * @param chave - Chave dentro da seção (ex: `'format.singleQuote'`).
     * @param valor - Valor a retornar quando a configuração for consultada.
     */
    definirConfiguracao(secao: string, chave: string, valor: unknown): void {
        _configuracoes.set(`${secao}.${chave}`, valor);
    },

    /**
     * Registra um arquivo no sistema de arquivos virtual de testes.
     *
     * @param uri - URI completa do arquivo (ex: `'file:///workspace/.yaml-profile.json'`).
     * @param conteudo - Conteúdo textual a retornar na leitura.
     */
    definirArquivo(uri: string, conteudo: string): void {
        _arquivos.set(uri, new TextEncoder().encode(conteudo));
    },

    /**
     * Configura `workspace.fs.readFile` para lançar o erro informado na URI indicada.
     *
     * @param uri - URI completa do arquivo.
     * @param erro - Erro a lançar na próxima leitura.
     */
    simularErroFs(uri: string, erro: Error): void {
        _errosFs.set(uri, erro);
    },

    /** Remove todas as configurações, arquivos e erros definidos — chamar no `beforeEach`. */
    limpar(): void {
        _configuracoes.clear();
        _arquivos.clear();
        _errosFs.clear();
    },
};

export const workspace = {
    getConfiguration(secao?: string): ConfiguracaoVsCodeMock {
        return new ConfiguracaoVsCodeMock(secao);
    },

    fs: {
        readFile(uri: { toString(): string }): Promise<Uint8Array> {
            const chave = uri.toString();

            const erroSimulado = _errosFs.get(chave);
            if (erroSimulado !== undefined) return Promise.reject(erroSimulado);

            const conteudo = _arquivos.get(chave);
            if (conteudo === undefined) {
                return Promise.reject(
                    Object.assign(new Error(`Arquivo não encontrado: ${chave}`), {
                        code: 'FileNotFound',
                    }),
                );
            }
            return Promise.resolve(conteudo);
        },
    },
};

export const Uri = {
    parse(value: string): UriMock {
        const separador = value.indexOf('://');
        if (separador !== -1) {
            return new UriMock(value.slice(0, separador), value.slice(separador + 3));
        }
        return new UriMock('', value);
    },

    joinPath(base: UriMock, ...segmentos: string[]): UriMock {
        const caminhoBase = base.path.replace(/\/$/, '');
        return new UriMock(base.scheme, `${caminhoBase}/${segmentos.join('/')}`);
    },
};
