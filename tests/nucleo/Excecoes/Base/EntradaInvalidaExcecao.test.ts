import { EntradaInvalidaExcecao } from '../../../../src/nucleo/Excecoes/Base/EntradaInvalidaExcecao';
import { YamlExtensaoExcecao } from '../../../../src/nucleo/Excecoes/Base/YamlExtensaoExcecao';

describe('EntradaInvalidaExcecaoTest', () => {
    test('Construtor_MensagemValida_DefineMessageCorretamente', () => {
        const excecao = new EntradaInvalidaExcecao('parâmetro ausente');

        expect(excecao.message).toBe('parâmetro ausente');
    });

    test('Construtor_MensagemValida_DefineNameComoEntradaInvalidaExcecao', () => {
        const excecao = new EntradaInvalidaExcecao('parâmetro ausente');

        expect(excecao.name).toBe('EntradaInvalidaExcecao');
    });

    test('Instancia_EntradaInvalidaExcecao_EhInstanceofYamlExtensaoExcecao', () => {
        const excecao = new EntradaInvalidaExcecao('parâmetro ausente');

        expect(excecao).toBeInstanceOf(YamlExtensaoExcecao);
    });

    test('Instancia_EntradaInvalidaExcecao_EhInstanceofError', () => {
        const excecao = new EntradaInvalidaExcecao('parâmetro ausente');

        expect(excecao).toBeInstanceOf(Error);
    });
});
