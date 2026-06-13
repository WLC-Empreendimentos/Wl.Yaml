import { PadraoArquivoInvalidoExcecao } from '../../../../src/nucleo/Excecoes/Perfil/PadraoArquivoInvalidoExcecao';
import { ConfiguracaoInvalidaExcecao } from '../../../../src/nucleo/Excecoes/Base/ConfiguracaoInvalidaExcecao';
import { YamlExtensaoExcecao } from '../../../../src/nucleo/Excecoes/Base/YamlExtensaoExcecao';

describe('PadraoArquivoInvalidoExcecaoTest', () => {
    test('Construtor_SemParametros_DefineMessageCorretamente', () => {
        const excecao = new PadraoArquivoInvalidoExcecao();

        expect(excecao.message).toBe('Padrão de arquivo não pode ser vazio.');
    });

    test('Construtor_SemParametros_DefineNameComoPadraoArquivoInvalidoExcecao', () => {
        const excecao = new PadraoArquivoInvalidoExcecao();

        expect(excecao.name).toBe('PadraoArquivoInvalidoExcecao');
    });

    test('Instancia_PadraoArquivoInvalidoExcecao_EhInstanceofConfiguracaoInvalidaExcecao', () => {
        const excecao = new PadraoArquivoInvalidoExcecao();

        expect(excecao).toBeInstanceOf(ConfiguracaoInvalidaExcecao);
    });

    test('Instancia_PadraoArquivoInvalidoExcecao_EhInstanceofYamlExtensaoExcecao', () => {
        const excecao = new PadraoArquivoInvalidoExcecao();

        expect(excecao).toBeInstanceOf(YamlExtensaoExcecao);
    });

    test('Instancia_PadraoArquivoInvalidoExcecao_EhInstanceofError', () => {
        const excecao = new PadraoArquivoInvalidoExcecao();

        expect(excecao).toBeInstanceOf(Error);
    });
});
