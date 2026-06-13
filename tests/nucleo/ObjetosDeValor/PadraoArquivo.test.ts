import { PadraoArquivo } from '../../../src/nucleo/ObjetosDeValor/PadraoArquivo';
import { PadraoArquivoInvalidoExcecao } from '../../../src/nucleo/Excecoes/Perfil/PadraoArquivoInvalidoExcecao';

describe('PadraoArquivoTest', () => {
    test('Construtor_ValorValido_ArmazenaValorNormalizado', () => {
        const padrao = new PadraoArquivo('**/*.yaml');

        expect(padrao.Valor).toBe('**/*.yaml');
    });

    test('Construtor_ValorComEspacos_ArmazenaValorAposTrim', () => {
        const padrao = new PadraoArquivo('  **/*.yaml  ');

        expect(padrao.Valor).toBe('**/*.yaml');
    });

    test('Construtor_StringVazia_LancaPadraoArquivoInvalidoExcecao', () => {
        expect(() => new PadraoArquivo('')).toThrow(PadraoArquivoInvalidoExcecao);
    });

    test('Construtor_StringSomenteEspacos_LancaPadraoArquivoInvalidoExcecao', () => {
        expect(() => new PadraoArquivo('   ')).toThrow(PadraoArquivoInvalidoExcecao);
    });

    test('Construtor_StringVazia_MensagemDescreveMotivo', () => {
        expect(() => new PadraoArquivo('')).toThrow('Padrão de arquivo não pode ser vazio.');
    });

    test('Iguala_MesmoValor_RetornaVerdadeiro', () => {
        const a = new PadraoArquivo('**/*.yaml');
        const b = new PadraoArquivo('**/*.yaml');

        expect(a.Iguala(b)).toBe(true);
    });

    test('Iguala_ValoresDiferentes_RetornaFalso', () => {
        const a = new PadraoArquivo('**/*.yaml');
        const b = new PadraoArquivo('**/*.yml');

        expect(a.Iguala(b)).toBe(false);
    });

    test('Iguala_ValoresEquivalentesAposTrim_RetornaVerdadeiro', () => {
        const a = new PadraoArquivo('**/*.yaml');
        const b = new PadraoArquivo('  **/*.yaml  ');

        expect(a.Iguala(b)).toBe(true);
    });
});
