import type { CancellationToken } from 'vscode';
import {
    CacheInvalidacaoSchemaMementoVsCode,
} from '../../../src/infraestrutura/Cache/CacheInvalidacaoSchemaMementoVsCode';
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

describe('CacheInvalidacaoSchemaMementoVsCodeTest', () => {
    let memento: MementoMock;

    beforeEach(() => {
        memento = new MementoMock();
    });

    function criarInvalidacao(): CacheInvalidacaoSchemaMementoVsCode {
        return new CacheInvalidacaoSchemaMementoVsCode(memento);
    }

    async function salvarEntrada(): Promise<void> {
        await new CacheRegistroSchemaMementoVsCode(memento)
            .SalvarAsync(URI, ETAG, CONTEUDO, ct);
    }

    it('InvalidarAsync_EntradaExistente_RemoveDoMemento', async () => {
        await salvarEntrada();

        await criarInvalidacao().InvalidarAsync(URI, ct);

        expect(memento.get(`wl-yaml.cache-schema.${URI}`)).toBeUndefined();
    });

    it('InvalidarAsync_EntradaInexistente_NaoLancaErro', async () => {
        await expect(criarInvalidacao().InvalidarAsync(URI, ct)).resolves.toBeUndefined();
    });

    it('InvalidarAsync_NaoAfetaOutrasUris', async () => {
        const uriB = 'https://json.schemastore.org/github-action';
        await salvarEntrada();
        await new CacheRegistroSchemaMementoVsCode(memento)
            .SalvarAsync(uriB, '"xyz"', 'schema b', ct);

        await criarInvalidacao().InvalidarAsync(URI, ct);

        expect(memento.get(`wl-yaml.cache-schema.${uriB}`)).toBeDefined();
    });
});
