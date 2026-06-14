import { PadraoArquivoValidador } from '../../../src/nucleo/Validadores/PadraoArquivoValidador';
import { PadraoArquivoInvalidoExcecao } from '../../../src/nucleo/Excecoes/Perfil/PadraoArquivoInvalidoExcecao';

describe('PadraoArquivoValidadorTest', () => {
    test('Validar_ValorValido_NaoLancaExcecao', () => {
        expect(() => { PadraoArquivoValidador.Validar('**/*.yaml'); }).not.toThrow();
    });

    test('Validar_StringVazia_LancaPadraoArquivoInvalidoExcecao', () => {
        expect(() => { PadraoArquivoValidador.Validar(''); }).toThrow(PadraoArquivoInvalidoExcecao);
    });

    test('Validar_StringSomenteEspacos_LancaPadraoArquivoInvalidoExcecao', () => {
        expect(() => { PadraoArquivoValidador.Validar('   '); }).toThrow(PadraoArquivoInvalidoExcecao);
    });
});
