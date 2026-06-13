import { PerfilInvalidoExcecao } from '../../../../src/nucleo/Excecoes/Perfil/PerfilInvalidoExcecao';
import { ConfiguracaoInvalidaExcecao } from '../../../../src/nucleo/Excecoes/Base/ConfiguracaoInvalidaExcecao';
import { YamlExtensaoExcecao } from '../../../../src/nucleo/Excecoes/Base/YamlExtensaoExcecao';

describe('PerfilInvalidoExcecaoTest', () => {
    test('Construtor_DetalheValido_FormataMensagemComPrefixo', () => {
        const excecao = new PerfilInvalidoExcecao('campo "indentacao" ausente');

        expect(excecao.message).toBe('Perfil de formatação inválido: campo "indentacao" ausente');
    });

    test('Construtor_DetalheValido_DefineNameComoPerfilInvalidoExcecao', () => {
        const excecao = new PerfilInvalidoExcecao('campo "indentacao" ausente');

        expect(excecao.name).toBe('PerfilInvalidoExcecao');
    });

    test('Instancia_PerfilInvalidoExcecao_EhInstanceofConfiguracaoInvalidaExcecao', () => {
        const excecao = new PerfilInvalidoExcecao('campo inválido');

        expect(excecao).toBeInstanceOf(ConfiguracaoInvalidaExcecao);
    });

    test('Instancia_PerfilInvalidoExcecao_EhInstanceofYamlExtensaoExcecao', () => {
        const excecao = new PerfilInvalidoExcecao('campo inválido');

        expect(excecao).toBeInstanceOf(YamlExtensaoExcecao);
    });

    test('Instancia_PerfilInvalidoExcecao_EhInstanceofError', () => {
        const excecao = new PerfilInvalidoExcecao('campo inválido');

        expect(excecao).toBeInstanceOf(Error);
    });
});
