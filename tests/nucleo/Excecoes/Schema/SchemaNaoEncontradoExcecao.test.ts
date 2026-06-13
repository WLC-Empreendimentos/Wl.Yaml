import { SchemaNaoEncontradoExcecao } from '../../../../src/nucleo/Excecoes/Schema/SchemaNaoEncontradoExcecao';
import { NaoEncontradoExcecao } from '../../../../src/nucleo/Excecoes/Base/NaoEncontradoExcecao';
import { YamlExtensaoExcecao } from '../../../../src/nucleo/Excecoes/Base/YamlExtensaoExcecao';

describe('SchemaNaoEncontradoExcecaoTest', () => {
    test('Construtor_UriValida_FormataMensagemComUri', () => {
        const excecao = new SchemaNaoEncontradoExcecao('https://json.schemastore.org/github-workflow');

        const mensagemEsperada = "Schema não encontrado para a URI 'https://json.schemastore.org/github-workflow'.";
        expect(excecao.message).toBe(mensagemEsperada);
    });

    test('Construtor_UriValida_DefineNameComoSchemaNaoEncontradoExcecao', () => {
        const excecao = new SchemaNaoEncontradoExcecao('https://json.schemastore.org/github-workflow');

        expect(excecao.name).toBe('SchemaNaoEncontradoExcecao');
    });

    test('Instancia_SchemaNaoEncontradoExcecao_EhInstanceofNaoEncontradoExcecao', () => {
        const excecao = new SchemaNaoEncontradoExcecao('https://json.schemastore.org/github-workflow');

        expect(excecao).toBeInstanceOf(NaoEncontradoExcecao);
    });

    test('Instancia_SchemaNaoEncontradoExcecao_EhInstanceofYamlExtensaoExcecao', () => {
        const excecao = new SchemaNaoEncontradoExcecao('https://json.schemastore.org/github-workflow');

        expect(excecao).toBeInstanceOf(YamlExtensaoExcecao);
    });

    test('Instancia_SchemaNaoEncontradoExcecao_EhInstanceofError', () => {
        const excecao = new SchemaNaoEncontradoExcecao('https://json.schemastore.org/github-workflow');

        expect(excecao).toBeInstanceOf(Error);
    });
});
