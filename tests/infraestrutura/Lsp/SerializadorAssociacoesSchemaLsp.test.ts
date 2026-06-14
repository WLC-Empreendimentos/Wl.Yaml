import { SerializadorAssociacoesSchemaLsp } from '../../../src/infraestrutura/Lsp/SerializadorAssociacoesSchemaLsp';
import { AssociacaoSchema } from '../../../src/nucleo/Entidades/AssociacaoSchema';
import { UriSchema } from '../../../src/nucleo/ObjetosDeValor/UriSchema';
import { PadraoArquivo } from '../../../src/nucleo/ObjetosDeValor/PadraoArquivo';

const URI_A = 'https://json.schemastore.org/schema-a.json';
const URI_B = 'https://json.schemastore.org/schema-b.json';

function criarAssociacao(uri: string, padrao: string): AssociacaoSchema {
    return new AssociacaoSchema(new UriSchema(uri), new PadraoArquivo(padrao));
}

describe('SerializadorAssociacoesSchemaLspTest', () => {
    it('Serializar_ListaVazia_RetornaMapaVazio', () => {
        expect(SerializadorAssociacoesSchemaLsp.Serializar([])).toEqual({});
    });

    it('Serializar_AssociacaoUnica_RetornaUriComPadraoEmArray', () => {
        const resultado = SerializadorAssociacoesSchemaLsp.Serializar([
            criarAssociacao(URI_A, '**/*.yaml'),
        ]);

        expect(resultado).toEqual({ [URI_A]: ['**/*.yaml'] });
    });

    it('Serializar_MultiplasPorUri_MesclaPadroesNaMesmaChave', () => {
        const resultado = SerializadorAssociacoesSchemaLsp.Serializar([
            criarAssociacao(URI_A, '**/*.yaml'),
            criarAssociacao(URI_A, '**/*.yml'),
        ]);

        expect(resultado).toEqual({ [URI_A]: ['**/*.yaml', '**/*.yml'] });
    });

    it('Serializar_UrisDistintas_MantemChavesSeparadas', () => {
        const resultado = SerializadorAssociacoesSchemaLsp.Serializar([
            criarAssociacao(URI_A, '**/*.yaml'),
            criarAssociacao(URI_B, '**/*.yml'),
        ]);

        expect(resultado).toEqual({ [URI_A]: ['**/*.yaml'], [URI_B]: ['**/*.yml'] });
    });
});
