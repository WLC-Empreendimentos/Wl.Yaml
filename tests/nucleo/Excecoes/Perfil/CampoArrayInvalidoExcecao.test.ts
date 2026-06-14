import { CampoArrayInvalidoExcecao } from '../../../../src/nucleo/Excecoes/Perfil/CampoArrayInvalidoExcecao';
import { PerfilInvalidoExcecao } from '../../../../src/nucleo/Excecoes/Perfil/PerfilInvalidoExcecao';
import { ConfiguracaoInvalidaExcecao } from '../../../../src/nucleo/Excecoes/Base/ConfiguracaoInvalidaExcecao';
import { YamlExtensaoExcecao } from '../../../../src/nucleo/Excecoes/Base/YamlExtensaoExcecao';

describe('CampoArrayInvalidoExcecaoTest', () => {
    test('Construtor_ContextoECampoValidos_FormataMensagemComContextoECampo', () => {
        const excecao = new CampoArrayInvalidoExcecao('arquivo de perfil', 'perfis');

        expect(excecao.message).toBe('Perfil de formatação inválido: arquivo de perfil.perfis deve ser um array');
    });

    test('Construtor_ContextoECampoValidos_DefineNameComoCampoArrayInvalidoExcecao', () => {
        const excecao = new CampoArrayInvalidoExcecao('arquivo de perfil', 'perfis');

        expect(excecao.name).toBe('CampoArrayInvalidoExcecao');
    });

    test('Instancia_CampoArrayInvalidoExcecao_EhInstanceofPerfilInvalidoExcecao', () => {
        const excecao = new CampoArrayInvalidoExcecao('arquivo de perfil', 'perfis');

        expect(excecao).toBeInstanceOf(PerfilInvalidoExcecao);
    });

    test('Instancia_CampoArrayInvalidoExcecao_EhInstanceofConfiguracaoInvalidaExcecao', () => {
        const excecao = new CampoArrayInvalidoExcecao('arquivo de perfil', 'perfis');

        expect(excecao).toBeInstanceOf(ConfiguracaoInvalidaExcecao);
    });

    test('Instancia_CampoArrayInvalidoExcecao_EhInstanceofYamlExtensaoExcecao', () => {
        const excecao = new CampoArrayInvalidoExcecao('arquivo de perfil', 'perfis');

        expect(excecao).toBeInstanceOf(YamlExtensaoExcecao);
    });

    test('Instancia_CampoArrayInvalidoExcecao_EhInstanceofError', () => {
        const excecao = new CampoArrayInvalidoExcecao('arquivo de perfil', 'perfis');

        expect(excecao).toBeInstanceOf(Error);
    });
});
