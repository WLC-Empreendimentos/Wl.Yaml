import { PerfilMalFormadoExcecao } from '../../../../src/nucleo/Excecoes/Perfil/PerfilMalFormadoExcecao';
import { PerfilInvalidoExcecao } from '../../../../src/nucleo/Excecoes/Perfil/PerfilInvalidoExcecao';
import { ConfiguracaoInvalidaExcecao } from '../../../../src/nucleo/Excecoes/Base/ConfiguracaoInvalidaExcecao';
import { YamlExtensaoExcecao } from '../../../../src/nucleo/Excecoes/Base/YamlExtensaoExcecao';

describe('PerfilMalFormadoExcecaoTest', () => {
    test('Construtor_ContextoECausaValidos_FormataMensagemComContextoECausa', () => {
        const excecao = new PerfilMalFormadoExcecao('perfis[0]', new Error('valor inválido'));

        expect(excecao.message).toBe('Perfil de formatação inválido: perfis[0]: Error: valor inválido');
    });

    test('Construtor_ContextoECausaValidos_DefineNameComoPerfilMalFormadoExcecao', () => {
        const excecao = new PerfilMalFormadoExcecao('perfis[0]', new Error('valor inválido'));

        expect(excecao.name).toBe('PerfilMalFormadoExcecao');
    });

    test('Instancia_PerfilMalFormadoExcecao_EhInstanceofPerfilInvalidoExcecao', () => {
        const excecao = new PerfilMalFormadoExcecao('perfis[0]', new Error('causa'));

        expect(excecao).toBeInstanceOf(PerfilInvalidoExcecao);
    });

    test('Instancia_PerfilMalFormadoExcecao_EhInstanceofConfiguracaoInvalidaExcecao', () => {
        const excecao = new PerfilMalFormadoExcecao('perfis[0]', new Error('causa'));

        expect(excecao).toBeInstanceOf(ConfiguracaoInvalidaExcecao);
    });

    test('Instancia_PerfilMalFormadoExcecao_EhInstanceofYamlExtensaoExcecao', () => {
        const excecao = new PerfilMalFormadoExcecao('perfis[0]', new Error('causa'));

        expect(excecao).toBeInstanceOf(YamlExtensaoExcecao);
    });

    test('Instancia_PerfilMalFormadoExcecao_EhInstanceofError', () => {
        const excecao = new PerfilMalFormadoExcecao('perfis[0]', new Error('causa'));

        expect(excecao).toBeInstanceOf(Error);
    });
});
