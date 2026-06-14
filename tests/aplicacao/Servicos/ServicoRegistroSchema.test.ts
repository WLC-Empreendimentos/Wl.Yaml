import type { CancellationToken } from 'vscode';
import type { IRepositorioSchema } from '../../../src/nucleo/Interfaces/Repositorios/IRepositorioSchema';
import { ServicoRegistroSchema } from '../../../src/aplicacao/Servicos/ServicoRegistroSchema';
import { AssociacaoSchema } from '../../../src/nucleo/Entidades/AssociacaoSchema';
import { UriSchemaInvalidaExcecao } from '../../../src/nucleo/Excecoes/Schema/UriSchemaInvalidaExcecao';
import { PadraoArquivoInvalidoExcecao } from '../../../src/nucleo/Excecoes/Perfil/PadraoArquivoInvalidoExcecao';

const ct = {} as CancellationToken;

const URI_SCHEMA = 'https://exemplo.com/schema.json';
const PADRAO = '**/*.yaml';

function criarServico(repositorioSchema: jest.Mocked<IRepositorioSchema>): ServicoRegistroSchema {
    return new ServicoRegistroSchema(repositorioSchema);
}

describe('ServicoRegistroSchemaTest', () => {
    let repositorioSchema: jest.Mocked<IRepositorioSchema>;

    beforeEach(() => {
        repositorioSchema = {
            ObterPorDocumentoAsync: jest.fn(),
            SalvarAsync: jest.fn(),
        };
    });

    it('Salvar_DadosValidos_ChamaRepositorioComEntidadeCorreta', async () => {
        repositorioSchema.SalvarAsync.mockResolvedValue(undefined);
        const servico = criarServico(repositorioSchema);

        await servico.SalvarAsync({ uriSchema: URI_SCHEMA, padraoArquivo: PADRAO }, ct);

        const [associacao] = repositorioSchema.SalvarAsync.mock.calls[0] ?? [];
        expect(associacao).toBeInstanceOf(AssociacaoSchema);
        expect((associacao as AssociacaoSchema).UriSchema.Valor).toBe(URI_SCHEMA);
        expect((associacao as AssociacaoSchema).PadraoArquivo.Valor).toBe(PADRAO);
    });

    it('Salvar_UriSchemaVazia_LancaExcecao', async () => {
        const servico = criarServico(repositorioSchema);

        await expect(servico.SalvarAsync({ uriSchema: '', padraoArquivo: PADRAO }, ct))
            .rejects.toThrow(UriSchemaInvalidaExcecao);
    });

    it('Salvar_PadraoArquivoVazio_LancaExcecao', async () => {
        const servico = criarServico(repositorioSchema);

        await expect(servico.SalvarAsync({ uriSchema: URI_SCHEMA, padraoArquivo: '' }, ct))
            .rejects.toThrow(PadraoArquivoInvalidoExcecao);
    });
});
