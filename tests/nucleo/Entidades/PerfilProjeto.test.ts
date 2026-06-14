import { PerfilProjeto } from '../../../src/nucleo/Entidades/PerfilProjeto';
import { PerfilFormatacao } from '../../../src/nucleo/Entidades/PerfilFormatacao';
import { PadraoArquivo } from '../../../src/nucleo/ObjetosDeValor/PadraoArquivo';
import { TamanhoIndentacao } from '../../../src/nucleo/ObjetosDeValor/TamanhoIndentacao';
import { TipoAspas } from '../../../src/nucleo/Enums/TipoAspas';
import { ModoQuebra } from '../../../src/nucleo/Enums/ModoQuebra';

function criarPerfil(padrao = '**/*.yaml'): PerfilFormatacao {
    return new PerfilFormatacao(
        new PadraoArquivo(padrao),
        new TamanhoIndentacao(2),
        TipoAspas.Simples,
        ModoQuebra.Preservar,
    );
}

describe('PerfilProjetoTest', () => {
    test('Perfis_AposConstrucaoComListaVazia_RetornaListaVazia', () => {
        const projeto = new PerfilProjeto([]);

        expect(projeto.Perfis).toHaveLength(0);
    });

    test('Perfis_AposConstrucaoComUmPerfil_RetornaListaComUmPerfil', () => {
        const perfil = criarPerfil();
        const projeto = new PerfilProjeto([perfil]);

        expect(projeto.Perfis).toHaveLength(1);
    });

    test('Perfis_AposConstrucao_RetornaListaInformada', () => {
        const perfil = criarPerfil('**/*.yaml');
        const projeto = new PerfilProjeto([perfil]);

        expect(projeto.Perfis[0]).toBe(perfil);
    });

});
