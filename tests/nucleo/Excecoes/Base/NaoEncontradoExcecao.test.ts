import { NaoEncontradoExcecao } from '../../../../src/nucleo/Excecoes/Base/NaoEncontradoExcecao';
import { YamlExtensaoExcecao } from '../../../../src/nucleo/Excecoes/Base/YamlExtensaoExcecao';

class NaoEncontradoConcrataParaTeste extends NaoEncontradoExcecao {
    constructor(mensagem: string) {
        super(mensagem);
    }
}

describe('NaoEncontradoExcecaoTest', () => {
    test('Construtor_MensagemValida_DefineMessageCorretamente', () => {
        const excecao = new NaoEncontradoConcrataParaTeste('recurso ausente');

        expect(excecao.message).toBe('recurso ausente');
    });

    test('Instancia_ExcecaoConcreta_EhInstanceofNaoEncontradoExcecao', () => {
        const excecao = new NaoEncontradoConcrataParaTeste('recurso ausente');

        expect(excecao).toBeInstanceOf(NaoEncontradoExcecao);
    });

    test('Instancia_ExcecaoConcreta_EhInstanceofYamlExtensaoExcecao', () => {
        const excecao = new NaoEncontradoConcrataParaTeste('recurso ausente');

        expect(excecao).toBeInstanceOf(YamlExtensaoExcecao);
    });

    test('Instancia_ExcecaoConcreta_EhInstanceofError', () => {
        const excecao = new NaoEncontradoConcrataParaTeste('recurso ausente');

        expect(excecao).toBeInstanceOf(Error);
    });
});
