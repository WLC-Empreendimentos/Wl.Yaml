import { SchemaInvalidoExcecao } from '../../../../src/nucleo/Excecoes/Schema/SchemaInvalidoExcecao';
import { ConfiguracaoInvalidaExcecao } from '../../../../src/nucleo/Excecoes/Base/ConfiguracaoInvalidaExcecao';
import { YamlExtensaoExcecao } from '../../../../src/nucleo/Excecoes/Base/YamlExtensaoExcecao';

describe('SchemaInvalidoExcecaoTest', () => {
    test('Construtor_DetalheValido_FormataMensagemComPrefixo', () => {
        const excecao = new SchemaInvalidoExcecao('estrutura JSON malformada');

        expect(excecao.message).toBe('Schema inválido: estrutura JSON malformada');
    });

    test('Construtor_DetalheValido_DefineNameComoSchemaInvalidoExcecao', () => {
        const excecao = new SchemaInvalidoExcecao('estrutura JSON malformada');

        expect(excecao.name).toBe('SchemaInvalidoExcecao');
    });

    test('Instancia_SchemaInvalidoExcecao_EhInstanceofConfiguracaoInvalidaExcecao', () => {
        const excecao = new SchemaInvalidoExcecao('estrutura JSON malformada');

        expect(excecao).toBeInstanceOf(ConfiguracaoInvalidaExcecao);
    });

    test('Instancia_SchemaInvalidoExcecao_EhInstanceofYamlExtensaoExcecao', () => {
        const excecao = new SchemaInvalidoExcecao('estrutura JSON malformada');

        expect(excecao).toBeInstanceOf(YamlExtensaoExcecao);
    });

    test('Instancia_SchemaInvalidoExcecao_EhInstanceofError', () => {
        const excecao = new SchemaInvalidoExcecao('estrutura JSON malformada');

        expect(excecao).toBeInstanceOf(Error);
    });
});
