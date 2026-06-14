import { __vscodeMock } from '../../__mocks__/vscode';
import { VerificadorFormatacaoVsCode } from '../../../src/infraestrutura/Repositorios/VerificadorFormatacaoVsCode';

function criarVerificador(): VerificadorFormatacaoVsCode {
    return new VerificadorFormatacaoVsCode();
}

describe('VerificadorFormatacaoVsCodeTest', () => {
    beforeEach(() => { __vscodeMock.limpar(); });

    it('FormatacaoHabilitada_SemConfiguracao_RetornaTrue', () => {
        expect(criarVerificador().FormatacaoHabilitada()).toBe(true);
    });

    it('FormatacaoHabilitada_ConfiguradoComoTrue_RetornaTrue', () => {
        __vscodeMock.definirConfiguracao('yaml', 'format.enable', true);

        expect(criarVerificador().FormatacaoHabilitada()).toBe(true);
    });

    it('FormatacaoHabilitada_ConfiguradoComoFalse_RetornaFalse', () => {
        __vscodeMock.definirConfiguracao('yaml', 'format.enable', false);

        expect(criarVerificador().FormatacaoHabilitada()).toBe(false);
    });
});
