import type { CancellationToken } from 'vscode';
import { __vscodeMock } from '../../__mocks__/vscode';
import { RepositorioPerfilProjetoJson } from '../../../src/infraestrutura/Repositorios/RepositorioPerfilProjetoJson';
import { PerfilInvalidoExcecao } from '../../../src/nucleo/Excecoes/Perfil/PerfilInvalidoExcecao';

const ct = {} as CancellationToken;

const URI_WORKSPACE = 'file:///workspace';
const URI_ARQUIVO = 'file:///workspace/.yaml-profile.json';

const PERFIL_VALIDO = {
    padraoArquivo: '**/*.yaml',
    tamanhoIndentacao: 2,
    tipoAspas: 'single',
    modoQuebra: 'preserve',
};

function criarRepositorio(): RepositorioPerfilProjetoJson {
    return new RepositorioPerfilProjetoJson();
}

describe('RepositorioPerfilProjetoJsonTest', () => {
    beforeEach(() => { __vscodeMock.limpar(); });

    it('ObterAsync_ArquivoNaoExiste_RetornaUndefined', async () => {
        const resultado = await criarRepositorio().ObterAsync(URI_WORKSPACE, ct);

        expect(resultado).toBeUndefined();
    });

    it('ObterAsync_ErroDePermissao_PropagaErroOriginal', async () => {
        const erroPermissao = new Error('Sem permissão');
        __vscodeMock.simularErroFs(URI_ARQUIVO, erroPermissao);

        await expect(criarRepositorio().ObterAsync(URI_WORKSPACE, ct))
            .rejects.toThrow('Sem permissão');
    });

    it('ObterAsync_JsonInvalido_LancaPerfilInvalidoExcecao', async () => {
        __vscodeMock.definirArquivo(URI_ARQUIVO, '{ json inválido }');

        await expect(criarRepositorio().ObterAsync(URI_WORKSPACE, ct))
            .rejects.toThrow(PerfilInvalidoExcecao);
    });

    it('ObterAsync_ArquivoValido_RetornaPerfilProjeto', async () => {
        __vscodeMock.definirArquivo(URI_ARQUIVO, JSON.stringify({ perfis: [PERFIL_VALIDO] }));

        const resultado = await criarRepositorio().ObterAsync(URI_WORKSPACE, ct);

        expect(resultado?.Perfis).toHaveLength(1);
    });
});
