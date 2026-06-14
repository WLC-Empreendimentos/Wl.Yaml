import type { CancellationToken } from 'vscode';
import {
    RepositorioRegistroSchemaMementoVsCode,
} from '../../../src/infraestrutura/Repositorios/RepositorioRegistroSchemaMementoVsCode';
import { AssociacaoSchema } from '../../../src/nucleo/Entidades/AssociacaoSchema';
import { UriSchema } from '../../../src/nucleo/ObjetosDeValor/UriSchema';
import { PadraoArquivo } from '../../../src/nucleo/ObjetosDeValor/PadraoArquivo';

const ct = {} as CancellationToken;

const URI_SCHEMA_A = 'https://json.schemastore.org/github-workflow';
const URI_SCHEMA_B = 'https://json.schemastore.org/github-action';
const PADRAO_YAML = '**/*.yaml';
const PADRAO_YML = '**/*.yml';

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

function criarAssociacao(uri: string, padrao: string): AssociacaoSchema {
    return new AssociacaoSchema(new UriSchema(uri), new PadraoArquivo(padrao));
}

type DadosSalvos = { uriSchema: string; padraoArquivo: string };

describe('RepositorioRegistroSchemaMementoVsCodeTest', () => {
    let memento: MementoMock;

    beforeEach(() => {
        memento = new MementoMock();
    });

    function criarRepositorio(): RepositorioRegistroSchemaMementoVsCode {
        return new RepositorioRegistroSchemaMementoVsCode(memento);
    }

    it('SalvarAsync_PrimeiraAssociacao_PersisteDadosNoMemento', async () => {
        const repositorio = criarRepositorio();

        await repositorio.SalvarAsync(criarAssociacao(URI_SCHEMA_A, PADRAO_YAML), ct);

        const salvo = memento.get('wl-yaml.associacoes-schema') as DadosSalvos[] | undefined;
        expect(salvo).toHaveLength(1);
        expect(salvo?.[0]?.uriSchema).toBe(URI_SCHEMA_A);
        expect(salvo?.[0]?.padraoArquivo).toBe(PADRAO_YAML);
    });

    it('SalvarAsync_DuasAssociacoesPadroesDiferentes_PersisteDuasEntradas', async () => {
        const repositorio = criarRepositorio();

        await repositorio.SalvarAsync(criarAssociacao(URI_SCHEMA_A, PADRAO_YAML), ct);
        await repositorio.SalvarAsync(criarAssociacao(URI_SCHEMA_B, PADRAO_YML), ct);

        const salvo = memento.get('wl-yaml.associacoes-schema') as unknown[] | undefined;
        expect(salvo).toHaveLength(2);
    });

    it('SalvarAsync_MesmoPadraoComSchemaDistinto_SubstituiEntradaAnterior', async () => {
        const repositorio = criarRepositorio();
        await repositorio.SalvarAsync(criarAssociacao(URI_SCHEMA_A, PADRAO_YAML), ct);

        await repositorio.SalvarAsync(criarAssociacao(URI_SCHEMA_B, PADRAO_YAML), ct);

        const salvo = memento.get('wl-yaml.associacoes-schema') as DadosSalvos[] | undefined;
        expect(salvo).toHaveLength(1);
        expect(salvo?.[0]?.uriSchema).toBe(URI_SCHEMA_B);
    });
});
