import { TamanhoIndentacaoValidador } from '../../../src/nucleo/Validadores/TamanhoIndentacaoValidador';
import { TamanhoIndentacaoInvalidoExcecao } from
    '../../../src/nucleo/Excecoes/Perfil/TamanhoIndentacaoInvalidoExcecao';

describe('TamanhoIndentacaoValidadorTest', () => {
    test('Validar_ValorMinimo_NaoLancaExcecao', () => {
        expect(() => { TamanhoIndentacaoValidador.Validar(1); }).not.toThrow();
    });

    test('Validar_ValorMaximo_NaoLancaExcecao', () => {
        expect(() => { TamanhoIndentacaoValidador.Validar(8); }).not.toThrow();
    });

    test('Validar_ValorZero_LancaTamanhoIndentacaoInvalidoExcecao', () => {
        expect(() => { TamanhoIndentacaoValidador.Validar(0); }).toThrow(TamanhoIndentacaoInvalidoExcecao);
    });

    test('Validar_ValorNove_LancaTamanhoIndentacaoInvalidoExcecao', () => {
        expect(() => { TamanhoIndentacaoValidador.Validar(9); }).toThrow(TamanhoIndentacaoInvalidoExcecao);
    });

    test('Validar_ValorNegativo_LancaTamanhoIndentacaoInvalidoExcecao', () => {
        expect(() => { TamanhoIndentacaoValidador.Validar(-1); }).toThrow(TamanhoIndentacaoInvalidoExcecao);
    });

    test('Validar_ValorDecimal_LancaTamanhoIndentacaoInvalidoExcecao', () => {
        expect(() => { TamanhoIndentacaoValidador.Validar(2.5); }).toThrow(TamanhoIndentacaoInvalidoExcecao);
    });
});
