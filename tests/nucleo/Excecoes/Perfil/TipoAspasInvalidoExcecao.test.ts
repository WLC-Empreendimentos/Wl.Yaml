import { TipoAspasInvalidoExcecao } from '../../../../src/nucleo/Excecoes/Perfil/TipoAspasInvalidoExcecao';
import { PerfilInvalidoExcecao } from '../../../../src/nucleo/Excecoes/Perfil/PerfilInvalidoExcecao';
import { ConfiguracaoInvalidaExcecao } from '../../../../src/nucleo/Excecoes/Base/ConfiguracaoInvalidaExcecao';
import { YamlExtensaoExcecao } from '../../../../src/nucleo/Excecoes/Base/YamlExtensaoExcecao';

describe('TipoAspasInvalidoExcecaoTest', () => {
    test('Construtor_ContextoEValorValidos_FormataMensagemComContextoEValor', () => {
        const excecao = new TipoAspasInvalidoExcecao('perfis[0]', 'backtick');

        expect(excecao.message).toBe('Perfil de formatação inválido: perfis[0].tipoAspas valor inválido: "backtick"');
    });

    test('Construtor_ContextoEValorValidos_DefineNameComoTipoAspasInvalidoExcecao', () => {
        const excecao = new TipoAspasInvalidoExcecao('perfis[0]', 'backtick');

        expect(excecao.name).toBe('TipoAspasInvalidoExcecao');
    });

    test('Instancia_TipoAspasInvalidoExcecao_EhInstanceofPerfilInvalidoExcecao', () => {
        const excecao = new TipoAspasInvalidoExcecao('perfis[0]', 'backtick');

        expect(excecao).toBeInstanceOf(PerfilInvalidoExcecao);
    });

    test('Instancia_TipoAspasInvalidoExcecao_EhInstanceofConfiguracaoInvalidaExcecao', () => {
        const excecao = new TipoAspasInvalidoExcecao('perfis[0]', 'backtick');

        expect(excecao).toBeInstanceOf(ConfiguracaoInvalidaExcecao);
    });

    test('Instancia_TipoAspasInvalidoExcecao_EhInstanceofYamlExtensaoExcecao', () => {
        const excecao = new TipoAspasInvalidoExcecao('perfis[0]', 'backtick');

        expect(excecao).toBeInstanceOf(YamlExtensaoExcecao);
    });

    test('Instancia_TipoAspasInvalidoExcecao_EhInstanceofError', () => {
        const excecao = new TipoAspasInvalidoExcecao('perfis[0]', 'backtick');

        expect(excecao).toBeInstanceOf(Error);
    });
});
