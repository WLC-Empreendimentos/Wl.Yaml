import { ModoQuebraInvalidoExcecao } from '../../../../src/nucleo/Excecoes/Perfil/ModoQuebraInvalidoExcecao';
import { PerfilInvalidoExcecao } from '../../../../src/nucleo/Excecoes/Perfil/PerfilInvalidoExcecao';
import { ConfiguracaoInvalidaExcecao } from '../../../../src/nucleo/Excecoes/Base/ConfiguracaoInvalidaExcecao';
import { YamlExtensaoExcecao } from '../../../../src/nucleo/Excecoes/Base/YamlExtensaoExcecao';

describe('ModoQuebraInvalidoExcecaoTest', () => {
    test('Construtor_ContextoEValorValidos_FormataMensagemComContextoEValor', () => {
        const excecao = new ModoQuebraInvalidoExcecao('perfis[0]', 'auto');

        expect(excecao.message).toBe('Perfil de formatação inválido: perfis[0].modoQuebra valor inválido: "auto"');
    });

    test('Construtor_ContextoEValorValidos_DefineNameComoModoQuebraInvalidoExcecao', () => {
        const excecao = new ModoQuebraInvalidoExcecao('perfis[0]', 'auto');

        expect(excecao.name).toBe('ModoQuebraInvalidoExcecao');
    });

    test('Instancia_ModoQuebraInvalidoExcecao_EhInstanceofPerfilInvalidoExcecao', () => {
        const excecao = new ModoQuebraInvalidoExcecao('perfis[0]', 'auto');

        expect(excecao).toBeInstanceOf(PerfilInvalidoExcecao);
    });

    test('Instancia_ModoQuebraInvalidoExcecao_EhInstanceofConfiguracaoInvalidaExcecao', () => {
        const excecao = new ModoQuebraInvalidoExcecao('perfis[0]', 'auto');

        expect(excecao).toBeInstanceOf(ConfiguracaoInvalidaExcecao);
    });

    test('Instancia_ModoQuebraInvalidoExcecao_EhInstanceofYamlExtensaoExcecao', () => {
        const excecao = new ModoQuebraInvalidoExcecao('perfis[0]', 'auto');

        expect(excecao).toBeInstanceOf(YamlExtensaoExcecao);
    });

    test('Instancia_ModoQuebraInvalidoExcecao_EhInstanceofError', () => {
        const excecao = new ModoQuebraInvalidoExcecao('perfis[0]', 'auto');

        expect(excecao).toBeInstanceOf(Error);
    });
});
