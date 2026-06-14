import { PerfilFormatacao } from '../../../src/nucleo/Entidades/PerfilFormatacao';
import { PadraoArquivo } from '../../../src/nucleo/ObjetosDeValor/PadraoArquivo';
import { TamanhoIndentacao } from '../../../src/nucleo/ObjetosDeValor/TamanhoIndentacao';
import { TipoAspas } from '../../../src/nucleo/Enums/TipoAspas';
import { ModoQuebra } from '../../../src/nucleo/Enums/ModoQuebra';

function criarPerfil(
    padrao = '**/*.yaml',
    indentacao = 2,
    aspas = TipoAspas.Simples,
    quebra = ModoQuebra.Preservar,
): PerfilFormatacao {
    return new PerfilFormatacao(
        new PadraoArquivo(padrao),
        new TamanhoIndentacao(indentacao),
        aspas,
        quebra,
    );
}

describe('PerfilFormatacaoTest', () => {
    test('PadraoArquivo_AposConstrucao_RetornaPadraoArquivoInformado', () => {
        const perfil = criarPerfil('**/k8s/**/*.yaml');

        expect(perfil.PadraoArquivo.Valor).toBe('**/k8s/**/*.yaml');
    });

    test('TamanhoIndentacao_AposConstrucao_RetornaTamanhoIndentacaoInformado', () => {
        const perfil = criarPerfil('**/*.yaml', 4);

        expect(perfil.TamanhoIndentacao.Valor).toBe(4);
    });

    test('TipoAspas_AposConstrucao_RetornaTipoAspasInformado', () => {
        const perfil = criarPerfil('**/*.yaml', 2, TipoAspas.Duplas);

        expect(perfil.TipoAspas).toBe(TipoAspas.Duplas);
    });

    test('ModoQuebra_AposConstrucao_RetornaModoQuebraInformado', () => {
        const perfil = criarPerfil('**/*.yaml', 2, TipoAspas.Simples, ModoQuebra.Sempre);

        expect(perfil.ModoQuebra).toBe(ModoQuebra.Sempre);
    });

    test('Iguala_ComMesmosAtributos_RetornaVerdadeiro', () => {
        const perfil = criarPerfil();
        const outro = criarPerfil();

        expect(perfil.Iguala(outro)).toBe(true);
    });

    test('Iguala_ComPadraoArquivoDiferente_RetornaFalso', () => {
        const perfil = criarPerfil('**/*.yaml');
        const outro = criarPerfil('**/k8s/**/*.yaml');

        expect(perfil.Iguala(outro)).toBe(false);
    });

    test('Iguala_ComTamanhoIndentacaoDiferente_RetornaFalso', () => {
        const perfil = criarPerfil('**/*.yaml', 2);
        const outro = criarPerfil('**/*.yaml', 4);

        expect(perfil.Iguala(outro)).toBe(false);
    });

    test('Iguala_ComTipoAspasDiferente_RetornaFalso', () => {
        const perfil = criarPerfil('**/*.yaml', 2, TipoAspas.Simples);
        const outro = criarPerfil('**/*.yaml', 2, TipoAspas.Duplas);

        expect(perfil.Iguala(outro)).toBe(false);
    });

    test('Iguala_ComModoQuebraDiferente_RetornaFalso', () => {
        const perfil = criarPerfil('**/*.yaml', 2, TipoAspas.Simples, ModoQuebra.Preservar);
        const outro = criarPerfil('**/*.yaml', 2, TipoAspas.Simples, ModoQuebra.Nunca);

        expect(perfil.Iguala(outro)).toBe(false);
    });
});
