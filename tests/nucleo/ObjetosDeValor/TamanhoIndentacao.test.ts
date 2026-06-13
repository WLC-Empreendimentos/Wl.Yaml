import { TamanhoIndentacao } from '../../../src/nucleo/ObjetosDeValor/TamanhoIndentacao';
import { TamanhoIndentacaoInvalidoExcecao } from '../../../src/nucleo/Excecoes/Perfil/TamanhoIndentacaoInvalidoExcecao';

describe('TamanhoIndentacaoTest', () => {
    test('Construtor_ValorMinimo_ArmazenaValor', () => {
        const tamanho = new TamanhoIndentacao(1);

        expect(tamanho.Valor).toBe(1);
    });

    test('Construtor_ValorMaximo_ArmazenaValor', () => {
        const tamanho = new TamanhoIndentacao(8);

        expect(tamanho.Valor).toBe(8);
    });

    test('Construtor_ValorZero_LancaTamanhoIndentacaoInvalidoExcecao', () => {
        expect(() => new TamanhoIndentacao(0)).toThrow(TamanhoIndentacaoInvalidoExcecao);
    });

    test('Construtor_ValorNove_LancaTamanhoIndentacaoInvalidoExcecao', () => {
        expect(() => new TamanhoIndentacao(9)).toThrow(TamanhoIndentacaoInvalidoExcecao);
    });

    test('Construtor_ValorNegativo_LancaTamanhoIndentacaoInvalidoExcecao', () => {
        expect(() => new TamanhoIndentacao(-1)).toThrow(TamanhoIndentacaoInvalidoExcecao);
    });

    test('Construtor_ValorDecimal_LancaTamanhoIndentacaoInvalidoExcecao', () => {
        expect(() => new TamanhoIndentacao(2.5)).toThrow(TamanhoIndentacaoInvalidoExcecao);
    });

    test('Construtor_ValorInvalido_MensagemDescreveIntervalo', () => {
        expect(() => new TamanhoIndentacao(0)).toThrow(
            'Tamanho de indentação deve ser um inteiro entre 1 e 8.',
        );
    });

    test('Iguala_MesmoValor_RetornaVerdadeiro', () => {
        const a = new TamanhoIndentacao(4);
        const b = new TamanhoIndentacao(4);

        expect(a.Iguala(b)).toBe(true);
    });

    test('Iguala_ValoresDiferentes_RetornaFalso', () => {
        const a = new TamanhoIndentacao(2);
        const b = new TamanhoIndentacao(4);

        expect(a.Iguala(b)).toBe(false);
    });
});
