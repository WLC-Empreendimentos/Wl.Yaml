import { AssociacaoSchemaMapeador } from '../../../src/aplicacao/Mapeadores/AssociacaoSchemaMapeador';
import { AssociacaoSchema } from '../../../src/nucleo/Entidades/AssociacaoSchema';
import { UriSchema } from '../../../src/nucleo/ObjetosDeValor/UriSchema';
import { PadraoArquivo } from '../../../src/nucleo/ObjetosDeValor/PadraoArquivo';

function criarAssociacao(uriSchema: string, padrao: string): AssociacaoSchema {
    return new AssociacaoSchema(new UriSchema(uriSchema), new PadraoArquivo(padrao));
}

describe('AssociacaoSchemaMapeadorTest', () => {
    it('ParaResposta_EntidadeValida_MapeiaUriSchemaCorretamente', () => {
        const entidade = criarAssociacao('https://exemplo.com/schema.json', '**/*.yaml');

        const resposta = AssociacaoSchemaMapeador.ParaResposta(entidade);

        expect(resposta.uriSchema).toBe('https://exemplo.com/schema.json');
    });

    it('ParaResposta_EntidadeValida_MapeiaPadraoArquivoCorretamente', () => {
        const entidade = criarAssociacao('https://exemplo.com/schema.json', '**/*.yaml');

        const resposta = AssociacaoSchemaMapeador.ParaResposta(entidade);

        expect(resposta.padraoArquivo).toBe('**/*.yaml');
    });
});
