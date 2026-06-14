import type { CancellationToken } from 'vscode';
import { CacheRegistroSchemaMementoVsCode } from '../../../src/infraestrutura/Cache/CacheRegistroSchemaMementoVsCode';

const ct = {} as CancellationToken;

const URI = 'https://json.schemastore.org/github-workflow';
const ETAG = '"abc123"';
const CONTEUDO = '{ "$schema": "http://json-schema.org/draft-07/schema#" }';

class MementoMock {
    private readonly _dados = new Map<string, unknown>();

    keys(): readonly string[] {
        return [...this._dados.keys()];
    }

    get(chave: string, valorPadrao?: unknown): unknown {
        const valor = this._dados.get(chave);
        return valor !== undefined ? valor : valorPadrao;
    }

    update(chave: string, valor: unknown): Promise<void> {
        if (valor === undefined) {
            this._dados.delete(chave);
        } else {
            this._dados.set(chave, valor);
        }
        return Promise.resolve();
    }
}

type EntradaCache = { etag: string; conteudo: string };

describe('CacheRegistroSchemaMementoVsCodeTest', () => {
    let memento: MementoMock;

    beforeEach(() => {
        memento = new MementoMock();
    });

    function criarRegistro(): CacheRegistroSchemaMementoVsCode {
        return new CacheRegistroSchemaMementoVsCode(memento);
    }

    it('SalvarAsync_PersistConteudoEEtagNoMemento', async () => {
        await criarRegistro().SalvarAsync(URI, ETAG, CONTEUDO, ct);

        const entrada = memento.get(`wl-yaml.cache-schema.${URI}`) as EntradaCache | undefined;
        expect(entrada?.etag).toBe(ETAG);
        expect(entrada?.conteudo).toBe(CONTEUDO);
    });

    it('SalvarAsync_SubstituiEntradaAnteriorComMesmaUri', async () => {
        const registro = criarRegistro();
        await registro.SalvarAsync(URI, '"v1"', 'schema v1', ct);

        await registro.SalvarAsync(URI, '"v2"', 'schema v2', ct);

        const entrada = memento.get(`wl-yaml.cache-schema.${URI}`) as EntradaCache | undefined;
        expect(entrada?.etag).toBe('"v2"');
        expect(entrada?.conteudo).toBe('schema v2');
    });

    it('SalvarAsync_UrisDistintas_PersisteDuasEntradasIndependentes', async () => {
        const uriB = 'https://json.schemastore.org/github-action';
        const registro = criarRegistro();

        await registro.SalvarAsync(URI, ETAG, CONTEUDO, ct);
        await registro.SalvarAsync(uriB, '"xyz"', 'schema b', ct);

        expect(memento.get(`wl-yaml.cache-schema.${URI}`)).toBeDefined();
        expect(memento.get(`wl-yaml.cache-schema.${uriB}`)).toBeDefined();
    });
});
