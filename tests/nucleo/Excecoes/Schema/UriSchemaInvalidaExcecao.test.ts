import { UriSchemaInvalidaExcecao } from '../../../../src/nucleo/Excecoes/Schema/UriSchemaInvalidaExcecao';
import { ConfiguracaoInvalidaExcecao } from '../../../../src/nucleo/Excecoes/Base/ConfiguracaoInvalidaExcecao';
import { YamlExtensaoExcecao } from '../../../../src/nucleo/Excecoes/Base/YamlExtensaoExcecao';

describe('UriSchemaInvalidaExcecaoTest', () => {
    test('Construtor_SemParametros_DefineMessageCorretamente', () => {
        const excecao = new UriSchemaInvalidaExcecao();

        expect(excecao.message).toBe('URI do schema não pode ser vazia.');
    });

    test('Construtor_SemParametros_DefineNameComoUriSchemaInvalidaExcecao', () => {
        const excecao = new UriSchemaInvalidaExcecao();

        expect(excecao.name).toBe('UriSchemaInvalidaExcecao');
    });

    test('Instancia_UriSchemaInvalidaExcecao_EhInstanceofConfiguracaoInvalidaExcecao', () => {
        const excecao = new UriSchemaInvalidaExcecao();

        expect(excecao).toBeInstanceOf(ConfiguracaoInvalidaExcecao);
    });

    test('Instancia_UriSchemaInvalidaExcecao_EhInstanceofYamlExtensaoExcecao', () => {
        const excecao = new UriSchemaInvalidaExcecao();

        expect(excecao).toBeInstanceOf(YamlExtensaoExcecao);
    });

    test('Instancia_UriSchemaInvalidaExcecao_EhInstanceofError', () => {
        const excecao = new UriSchemaInvalidaExcecao();

        expect(excecao).toBeInstanceOf(Error);
    });
});
