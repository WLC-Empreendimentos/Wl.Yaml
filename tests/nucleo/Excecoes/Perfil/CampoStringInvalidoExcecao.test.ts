import { CampoStringInvalidoExcecao } from '../../../../src/nucleo/Excecoes/Perfil/CampoStringInvalidoExcecao';
import { PerfilInvalidoExcecao } from '../../../../src/nucleo/Excecoes/Perfil/PerfilInvalidoExcecao';
import { ConfiguracaoInvalidaExcecao } from '../../../../src/nucleo/Excecoes/Base/ConfiguracaoInvalidaExcecao';
import { YamlExtensaoExcecao } from '../../../../src/nucleo/Excecoes/Base/YamlExtensaoExcecao';

describe('CampoStringInvalidoExcecaoTest', () => {
    test('Construtor_ContextoECampoValidos_FormataMensagemComContextoECampo', () => {
        const excecao = new CampoStringInvalidoExcecao('perfis[0]', 'padraoArquivo');

        expect(excecao.message).toBe('Perfil de formatação inválido: perfis[0].padraoArquivo deve ser uma string');
    });

    test('Construtor_ContextoECampoValidos_DefineNameComoCampoStringInvalidoExcecao', () => {
        const excecao = new CampoStringInvalidoExcecao('perfis[0]', 'padraoArquivo');

        expect(excecao.name).toBe('CampoStringInvalidoExcecao');
    });

    test('Instancia_CampoStringInvalidoExcecao_EhInstanceofPerfilInvalidoExcecao', () => {
        const excecao = new CampoStringInvalidoExcecao('perfis[0]', 'padraoArquivo');

        expect(excecao).toBeInstanceOf(PerfilInvalidoExcecao);
    });

    test('Instancia_CampoStringInvalidoExcecao_EhInstanceofConfiguracaoInvalidaExcecao', () => {
        const excecao = new CampoStringInvalidoExcecao('perfis[0]', 'padraoArquivo');

        expect(excecao).toBeInstanceOf(ConfiguracaoInvalidaExcecao);
    });

    test('Instancia_CampoStringInvalidoExcecao_EhInstanceofYamlExtensaoExcecao', () => {
        const excecao = new CampoStringInvalidoExcecao('perfis[0]', 'padraoArquivo');

        expect(excecao).toBeInstanceOf(YamlExtensaoExcecao);
    });

    test('Instancia_CampoStringInvalidoExcecao_EhInstanceofError', () => {
        const excecao = new CampoStringInvalidoExcecao('perfis[0]', 'padraoArquivo');

        expect(excecao).toBeInstanceOf(Error);
    });
});
