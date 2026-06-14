import type { CancellationToken } from 'vscode';
import type { IRepositorioSchema } from '../../../src/nucleo/Interfaces/Repositorios/IRepositorioSchema';
import { ServicoConsultaSchema } from '../../../src/aplicacao/Servicos/ServicoConsultaSchema';
import { AssociacaoSchema } from '../../../src/nucleo/Entidades/AssociacaoSchema';
import { UriSchema } from '../../../src/nucleo/ObjetosDeValor/UriSchema';
import { PadraoArquivo } from '../../../src/nucleo/ObjetosDeValor/PadraoArquivo';
import { UriDocumentoInvalidaExcecao } from '../../../src/nucleo/Excecoes/Documento/UriDocumentoInvalidaExcecao';

const ct = {} as CancellationToken;

const URI_DOCUMENTO = '/workspace/config.yaml';
const URI_SCHEMA = 'https://exemplo.com/schema.json';
const PADRAO = '**/*.yaml';

function criarAssociacao(): AssociacaoSchema {
    return new AssociacaoSchema(new UriSchema(URI_SCHEMA), new PadraoArquivo(PADRAO));
}

function criarServico(repositorioSchema: jest.Mocked<IRepositorioSchema>): ServicoConsultaSchema {
    return new ServicoConsultaSchema(repositorioSchema);
}

describe('ServicoConsultaSchemaTest', () => {
    let repositorioSchema: jest.Mocked<IRepositorioSchema>;

    beforeEach(() => {
        repositorioSchema = {
            ObterPorDocumentoAsync: jest.fn(),
            SalvarAsync: jest.fn(),
        };
    });

    it('ObterPorDocumento_AssociacaoEncontrada_RetornaResposta', async () => {
        repositorioSchema.ObterPorDocumentoAsync.mockResolvedValue(criarAssociacao());
        const servico = criarServico(repositorioSchema);

        const resposta = await servico.ObterPorDocumentoAsync({ uriDocumento: URI_DOCUMENTO }, ct);

        expect(resposta?.uriSchema).toBe(URI_SCHEMA);
        expect(resposta?.padraoArquivo).toBe(PADRAO);
    });

    it('ObterPorDocumento_AssociacaoNaoEncontrada_RetornaUndefined', async () => {
        repositorioSchema.ObterPorDocumentoAsync.mockResolvedValue(undefined);
        const servico = criarServico(repositorioSchema);

        const resposta = await servico.ObterPorDocumentoAsync({ uriDocumento: URI_DOCUMENTO }, ct);

        expect(resposta).toBeUndefined();
    });

    it('ObterPorDocumento_UriDocumentoVazia_LancaExcecao', async () => {
        const servico = criarServico(repositorioSchema);

        await expect(servico.ObterPorDocumentoAsync({ uriDocumento: '   ' }, ct))
            .rejects.toThrow(UriDocumentoInvalidaExcecao);
    });
});
