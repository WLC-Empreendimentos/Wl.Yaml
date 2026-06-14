import { PerfilJsonInvalidoExcecao } from '../../../../src/nucleo/Excecoes/Perfil/PerfilJsonInvalidoExcecao';
import { PerfilInvalidoExcecao } from '../../../../src/nucleo/Excecoes/Perfil/PerfilInvalidoExcecao';
import { ConfiguracaoInvalidaExcecao } from '../../../../src/nucleo/Excecoes/Base/ConfiguracaoInvalidaExcecao';
import { YamlExtensaoExcecao } from '../../../../src/nucleo/Excecoes/Base/YamlExtensaoExcecao';

describe('PerfilJsonInvalidoExcecaoTest', () => {
    test('Construtor_SemParametros_FormataMensagemDeJsonInvalido', () => {
        const excecao = new PerfilJsonInvalidoExcecao();

        expect(excecao.message).toBe('Perfil de formatação inválido: JSON inválido');
    });

    test('Construtor_SemParametros_DefineNameComoPerfilJsonInvalidoExcecao', () => {
        const excecao = new PerfilJsonInvalidoExcecao();

        expect(excecao.name).toBe('PerfilJsonInvalidoExcecao');
    });

    test('Instancia_PerfilJsonInvalidoExcecao_EhInstanceofPerfilInvalidoExcecao', () => {
        const excecao = new PerfilJsonInvalidoExcecao();

        expect(excecao).toBeInstanceOf(PerfilInvalidoExcecao);
    });

    test('Instancia_PerfilJsonInvalidoExcecao_EhInstanceofConfiguracaoInvalidaExcecao', () => {
        const excecao = new PerfilJsonInvalidoExcecao();

        expect(excecao).toBeInstanceOf(ConfiguracaoInvalidaExcecao);
    });

    test('Instancia_PerfilJsonInvalidoExcecao_EhInstanceofYamlExtensaoExcecao', () => {
        const excecao = new PerfilJsonInvalidoExcecao();

        expect(excecao).toBeInstanceOf(YamlExtensaoExcecao);
    });

    test('Instancia_PerfilJsonInvalidoExcecao_EhInstanceofError', () => {
        const excecao = new PerfilJsonInvalidoExcecao();

        expect(excecao).toBeInstanceOf(Error);
    });
});
