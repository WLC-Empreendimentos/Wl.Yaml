import type { CancellationToken } from 'vscode';
import {
    CacheConsultaEtagSchemaMementoVsCode,
} from '../../../src/infraestrutura/Cache/CacheConsultaEtagSchemaMementoVsCode';
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

describe('CacheConsultaEtagSchemaMementoVsCodeTest', () => {
    let memento: MementoMock;

    beforeEach(() => {
        memento = new MementoMock();
    });

    function criarConsulta(): CacheConsultaEtagSchemaMementoVsCode {
        return new CacheConsultaEtagSchemaMementoVsCode(memento);
    }

    async function salvarEntrada(): Promise<void> {
        await new CacheRegistroSchemaMementoVsCode(memento)
            .SalvarAsync(URI, ETAG, CONTEUDO, ct);
    }

    it('ObterAsync_CacheVazio_RetornaUndefined', async () => {
        const resultado = await criarConsulta().ObterAsync(URI, ct);

        expect(resultado).toBeUndefined();
    });

    it('ObterAsync_EntradaSalva_RetornaEtag', async () => {
        await salvarEntrada();

        const resultado = await criarConsulta().ObterAsync(URI, ct);

        expect(resultado).toBe(ETAG);
    });

    it('ObterAsync_UriDistinta_RetornaUndefined', async () => {
        await salvarEntrada();

        const resultado = await criarConsulta().ObterAsync('https://outro.com/schema.json', ct);

        expect(resultado).toBeUndefined();
    });
});
