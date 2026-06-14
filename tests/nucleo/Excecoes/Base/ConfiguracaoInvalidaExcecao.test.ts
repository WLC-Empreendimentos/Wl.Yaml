import { ConfiguracaoInvalidaExcecao } from '../../../../src/nucleo/Excecoes/Base/ConfiguracaoInvalidaExcecao';
import { YamlExtensaoExcecao } from '../../../../src/nucleo/Excecoes/Base/YamlExtensaoExcecao';

class ConfiguracaoInvalidaConcrataParaTeste extends ConfiguracaoInvalidaExcecao {}

describe('ConfiguracaoInvalidaExcecaoTest', () => {
    test('Construtor_MensagemValida_DefineMessageCorretamente', () => {
        const excecao = new ConfiguracaoInvalidaConcrataParaTeste('configuração inválida');

        expect(excecao.message).toBe('configuração inválida');
    });

    test('Instancia_ExcecaoConcreta_EhInstanceofConfiguracaoInvalidaExcecao', () => {
        const excecao = new ConfiguracaoInvalidaConcrataParaTeste('configuração inválida');

        expect(excecao).toBeInstanceOf(ConfiguracaoInvalidaExcecao);
    });

    test('Instancia_ExcecaoConcreta_EhInstanceofYamlExtensaoExcecao', () => {
        const excecao = new ConfiguracaoInvalidaConcrataParaTeste('configuração inválida');

        expect(excecao).toBeInstanceOf(YamlExtensaoExcecao);
    });

    test('Instancia_ExcecaoConcreta_EhInstanceofError', () => {
        const excecao = new ConfiguracaoInvalidaConcrataParaTeste('configuração inválida');

        expect(excecao).toBeInstanceOf(Error);
    });
});
