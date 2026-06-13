import { YamlExtensaoExcecao } from '../../../../src/nucleo/Excecoes/Base/YamlExtensaoExcecao';

class ExcecaoConcrataParaTeste extends YamlExtensaoExcecao {
    constructor(mensagem: string) {
        super(mensagem);
    }
}

describe('YamlExtensaoExcecaoTest', () => {
    test('Construtor_MensagemValida_DefineMessageCorretamente', () => {
        const excecao = new ExcecaoConcrataParaTeste('erro de teste');

        expect(excecao.message).toBe('erro de teste');
    });

    test('Construtor_MensagemValida_DefineNameComoNomeDoConstrutorConcreto', () => {
        const excecao = new ExcecaoConcrataParaTeste('erro de teste');

        expect(excecao.name).toBe('ExcecaoConcrataParaTeste');
    });

    test('Instancia_ExcecaoConcreta_EhInstanceofError', () => {
        const excecao = new ExcecaoConcrataParaTeste('erro de teste');

        expect(excecao).toBeInstanceOf(Error);
    });

    test('Instancia_ExcecaoConcreta_EhInstanceofYamlExtensaoExcecao', () => {
        const excecao = new ExcecaoConcrataParaTeste('erro de teste');

        expect(excecao).toBeInstanceOf(YamlExtensaoExcecao);
    });
});
