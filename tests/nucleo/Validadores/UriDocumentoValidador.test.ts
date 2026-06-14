import { UriDocumentoValidador } from '../../../src/nucleo/Validadores/UriDocumentoValidador';
import { UriDocumentoInvalidaExcecao } from
    '../../../src/nucleo/Excecoes/Documento/UriDocumentoInvalidaExcecao';

describe('UriDocumentoValidadorTest', () => {
    test('Validar_ComUriValida_NaoLancaExcecao', () => {
        expect(() => { UriDocumentoValidador.Validar('file:///projeto/config.yaml'); }).not.toThrow();
    });

    test('Validar_ComUriVazia_LancaUriDocumentoInvalidaExcecao', () => {
        expect(() => { UriDocumentoValidador.Validar(''); }).toThrow(UriDocumentoInvalidaExcecao);
    });

    test('Validar_ComUriSomenteEspacos_LancaUriDocumentoInvalidaExcecao', () => {
        expect(() => { UriDocumentoValidador.Validar('   '); }).toThrow(UriDocumentoInvalidaExcecao);
    });
});
