import { ObjetoJsonInvalidoExcecao } from '../../../../src/nucleo/Excecoes/Perfil/ObjetoJsonInvalidoExcecao';
import { PerfilInvalidoExcecao } from '../../../../src/nucleo/Excecoes/Perfil/PerfilInvalidoExcecao';
import { ConfiguracaoInvalidaExcecao } from '../../../../src/nucleo/Excecoes/Base/ConfiguracaoInvalidaExcecao';
import { YamlExtensaoExcecao } from '../../../../src/nucleo/Excecoes/Base/YamlExtensaoExcecao';

describe('ObjetoJsonInvalidoExcecaoTest', () => {
    test('Construtor_ContextoValido_FormataMensagemComContexto', () => {
        const excecao = new ObjetoJsonInvalidoExcecao('arquivo de perfil');

        expect(excecao.message).toBe('Perfil de formatação inválido: arquivo de perfil deve ser um objeto');
    });

    test('Construtor_ContextoValido_DefineNameComoObjetoJsonInvalidoExcecao', () => {
        const excecao = new ObjetoJsonInvalidoExcecao('arquivo de perfil');

        expect(excecao.name).toBe('ObjetoJsonInvalidoExcecao');
    });

    test('Instancia_ObjetoJsonInvalidoExcecao_EhInstanceofPerfilInvalidoExcecao', () => {
        const excecao = new ObjetoJsonInvalidoExcecao('arquivo de perfil');

        expect(excecao).toBeInstanceOf(PerfilInvalidoExcecao);
    });

    test('Instancia_ObjetoJsonInvalidoExcecao_EhInstanceofConfiguracaoInvalidaExcecao', () => {
        const excecao = new ObjetoJsonInvalidoExcecao('arquivo de perfil');

        expect(excecao).toBeInstanceOf(ConfiguracaoInvalidaExcecao);
    });

    test('Instancia_ObjetoJsonInvalidoExcecao_EhInstanceofYamlExtensaoExcecao', () => {
        const excecao = new ObjetoJsonInvalidoExcecao('arquivo de perfil');

        expect(excecao).toBeInstanceOf(YamlExtensaoExcecao);
    });

    test('Instancia_ObjetoJsonInvalidoExcecao_EhInstanceofError', () => {
        const excecao = new ObjetoJsonInvalidoExcecao('arquivo de perfil');

        expect(excecao).toBeInstanceOf(Error);
    });
});
