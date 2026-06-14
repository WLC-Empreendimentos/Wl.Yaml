import type { CancellationToken } from 'vscode';
import { __vscodeMock } from '../../__mocks__/vscode';
import { RepositorioPerfilPadraoVsCode } from '../../../src/infraestrutura/Repositorios/RepositorioPerfilPadraoVsCode';
import { TipoAspas } from '../../../src/nucleo/Enums/TipoAspas';
import { ModoQuebra } from '../../../src/nucleo/Enums/ModoQuebra';

const ct = {} as CancellationToken;

function criarRepositorio(): RepositorioPerfilPadraoVsCode {
    return new RepositorioPerfilPadraoVsCode();
}

describe('RepositorioPerfilPadraoVsCodeTest', () => {
    beforeEach(() => { __vscodeMock.limpar(); });

    it('ObterAsync_SemConfiguracao_RetornaPerfilComPadroes', async () => {
        const perfil = await criarRepositorio().ObterAsync(ct);

        expect(perfil.TamanhoIndentacao.Valor).toBe(2);
        expect(perfil.TipoAspas).toBe(TipoAspas.Duplas);
        expect(perfil.ModoQuebra).toBe(ModoQuebra.Preservar);
        expect(perfil.PadraoArquivo.Valor).toBe('**/*.yaml');
    });

    it('ObterAsync_SingleQuoteTrue_RetornaAspasSimples', async () => {
        __vscodeMock.definirConfiguracao('yaml', 'format.singleQuote', true);

        const perfil = await criarRepositorio().ObterAsync(ct);

        expect(perfil.TipoAspas).toBe(TipoAspas.Simples);
    });

    it('ObterAsync_SingleQuoteFalse_RetornaAspasDuplas', async () => {
        __vscodeMock.definirConfiguracao('yaml', 'format.singleQuote', false);

        const perfil = await criarRepositorio().ObterAsync(ct);

        expect(perfil.TipoAspas).toBe(TipoAspas.Duplas);
    });

    it('ObterAsync_ProseWrapNever_RetornaModoQuebraNunca', async () => {
        __vscodeMock.definirConfiguracao('yaml', 'format.proseWrap', 'never');

        const perfil = await criarRepositorio().ObterAsync(ct);

        expect(perfil.ModoQuebra).toBe(ModoQuebra.Nunca);
    });

    it('ObterAsync_ProseWrapAlways_RetornaModoQuebraSempre', async () => {
        __vscodeMock.definirConfiguracao('yaml', 'format.proseWrap', 'always');

        const perfil = await criarRepositorio().ObterAsync(ct);

        expect(perfil.ModoQuebra).toBe(ModoQuebra.Sempre);
    });

    it('ObterAsync_ProseWrapPreserve_RetornaModoQuebraPreservar', async () => {
        __vscodeMock.definirConfiguracao('yaml', 'format.proseWrap', 'preserve');

        const perfil = await criarRepositorio().ObterAsync(ct);

        expect(perfil.ModoQuebra).toBe(ModoQuebra.Preservar);
    });

    it('ObterAsync_TabSizeQuatro_RetornaIndentacaoQuatro', async () => {
        __vscodeMock.definirConfiguracao('editor', 'tabSize', 4);

        const perfil = await criarRepositorio().ObterAsync(ct);

        expect(perfil.TamanhoIndentacao.Valor).toBe(4);
    });

    it('ObterAsync_ProseWrapDesconhecido_RetornaModoQuebraPreservar', async () => {
        __vscodeMock.definirConfiguracao('yaml', 'format.proseWrap', 'auto');

        const perfil = await criarRepositorio().ObterAsync(ct);

        expect(perfil.ModoQuebra).toBe(ModoQuebra.Preservar);
    });
});
