import { TamanhoIndentacaoInvalidoExcecao } from
    '../../../../src/nucleo/Excecoes/Perfil/TamanhoIndentacaoInvalidoExcecao';
import { ConfiguracaoInvalidaExcecao } from '../../../../src/nucleo/Excecoes/Base/ConfiguracaoInvalidaExcecao';
import { YamlExtensaoExcecao } from '../../../../src/nucleo/Excecoes/Base/YamlExtensaoExcecao';

describe('TamanhoIndentacaoInvalidoExcecaoTest', () => {
    test('Construtor_SemParametros_DefineMessageCorretamente', () => {
        const excecao = new TamanhoIndentacaoInvalidoExcecao();

        expect(excecao.message).toBe('Tamanho de indentação deve ser um inteiro entre 1 e 8.');
    });

    test('Construtor_SemParametros_DefineNameComoTamanhoIndentacaoInvalidoExcecao', () => {
        const excecao = new TamanhoIndentacaoInvalidoExcecao();

        expect(excecao.name).toBe('TamanhoIndentacaoInvalidoExcecao');
    });

    test('Instancia_TamanhoIndentacaoInvalidoExcecao_EhInstanceofConfiguracaoInvalidaExcecao', () => {
        const excecao = new TamanhoIndentacaoInvalidoExcecao();

        expect(excecao).toBeInstanceOf(ConfiguracaoInvalidaExcecao);
    });

    test('Instancia_TamanhoIndentacaoInvalidoExcecao_EhInstanceofYamlExtensaoExcecao', () => {
        const excecao = new TamanhoIndentacaoInvalidoExcecao();

        expect(excecao).toBeInstanceOf(YamlExtensaoExcecao);
    });

    test('Instancia_TamanhoIndentacaoInvalidoExcecao_EhInstanceofError', () => {
        const excecao = new TamanhoIndentacaoInvalidoExcecao();

        expect(excecao).toBeInstanceOf(Error);
    });
});
