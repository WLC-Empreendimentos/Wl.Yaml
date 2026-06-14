import { AssociacaoSchema } from '../../../src/nucleo/Entidades/AssociacaoSchema';
import { UriSchema } from '../../../src/nucleo/ObjetosDeValor/UriSchema';
import { PadraoArquivo } from '../../../src/nucleo/ObjetosDeValor/PadraoArquivo';

function criarAssociacao(
    uri = 'https://json.schemastore.org/github-workflow.json',
    padrao = '.github/workflows/*.yaml',
): AssociacaoSchema {
    return new AssociacaoSchema(new UriSchema(uri), new PadraoArquivo(padrao));
}

describe('AssociacaoSchemaTest', () => {
    test('UriSchema_AposConstrucao_RetornaUriSchemaInformada', () => {
        const associacao = criarAssociacao('https://json.schemastore.org/github-workflow.json');

        expect(associacao.UriSchema.Valor).toBe('https://json.schemastore.org/github-workflow.json');
    });

    test('PadraoArquivo_AposConstrucao_RetornaPadraoArquivoInformado', () => {
        const associacao = criarAssociacao('https://json.schemastore.org/github-workflow.json', '**/*.yaml');

        expect(associacao.PadraoArquivo.Valor).toBe('**/*.yaml');
    });

    test('Iguala_ComMesmosAtributos_RetornaVerdadeiro', () => {
        const associacao = criarAssociacao();
        const outra = criarAssociacao();

        expect(associacao.Iguala(outra)).toBe(true);
    });

    test('Iguala_ComUriSchemaDiferente_RetornaFalso', () => {
        const associacao = criarAssociacao('https://json.schemastore.org/github-workflow.json');
        const outra = criarAssociacao('https://json.schemastore.org/docker-compose.json');

        expect(associacao.Iguala(outra)).toBe(false);
    });

    test('Iguala_ComPadraoArquivoDiferente_RetornaFalso', () => {
        const associacao = criarAssociacao('https://json.schemastore.org/github-workflow.json', '**/*.yaml');
        const outra = criarAssociacao('https://json.schemastore.org/github-workflow.json', '**/k8s/**/*.yaml');

        expect(associacao.Iguala(outra)).toBe(false);
    });
});
