import { CampoNumeroInvalidoExcecao } from '../../../../src/nucleo/Excecoes/Perfil/CampoNumeroInvalidoExcecao';
import { PerfilInvalidoExcecao } from '../../../../src/nucleo/Excecoes/Perfil/PerfilInvalidoExcecao';
import { ConfiguracaoInvalidaExcecao } from '../../../../src/nucleo/Excecoes/Base/ConfiguracaoInvalidaExcecao';
import { YamlExtensaoExcecao } from '../../../../src/nucleo/Excecoes/Base/YamlExtensaoExcecao';

describe('CampoNumeroInvalidoExcecaoTest', () => {
    test('Construtor_ContextoECampoValidos_FormataMensagemComContextoECampo', () => {
        const excecao = new CampoNumeroInvalidoExcecao('perfis[0]', 'tamanhoIndentacao');

        expect(excecao.message).toBe('Perfil de formatação inválido: perfis[0].tamanhoIndentacao deve ser um número');
    });

    test('Construtor_ContextoECampoValidos_DefineNameComoCampoNumeroInvalidoExcecao', () => {
        const excecao = new CampoNumeroInvalidoExcecao('perfis[0]', 'tamanhoIndentacao');

        expect(excecao.name).toBe('CampoNumeroInvalidoExcecao');
    });

    test('Instancia_CampoNumeroInvalidoExcecao_EhInstanceofPerfilInvalidoExcecao', () => {
        const excecao = new CampoNumeroInvalidoExcecao('perfis[0]', 'tamanhoIndentacao');

        expect(excecao).toBeInstanceOf(PerfilInvalidoExcecao);
    });

    test('Instancia_CampoNumeroInvalidoExcecao_EhInstanceofConfiguracaoInvalidaExcecao', () => {
        const excecao = new CampoNumeroInvalidoExcecao('perfis[0]', 'tamanhoIndentacao');

        expect(excecao).toBeInstanceOf(ConfiguracaoInvalidaExcecao);
    });

    test('Instancia_CampoNumeroInvalidoExcecao_EhInstanceofYamlExtensaoExcecao', () => {
        const excecao = new CampoNumeroInvalidoExcecao('perfis[0]', 'tamanhoIndentacao');

        expect(excecao).toBeInstanceOf(YamlExtensaoExcecao);
    });

    test('Instancia_CampoNumeroInvalidoExcecao_EhInstanceofError', () => {
        const excecao = new CampoNumeroInvalidoExcecao('perfis[0]', 'tamanhoIndentacao');

        expect(excecao).toBeInstanceOf(Error);
    });
});
