import { UriDocumentoInvalidaExcecao } from
    '../../../../src/nucleo/Excecoes/Documento/UriDocumentoInvalidaExcecao';
import { EntradaInvalidaExcecao } from '../../../../src/nucleo/Excecoes/Base/EntradaInvalidaExcecao';
import { YamlExtensaoExcecao } from '../../../../src/nucleo/Excecoes/Base/YamlExtensaoExcecao';

describe('UriDocumentoInvalidaExcecaoTest', () => {
    test('Construtor_SemParametros_DefineMessageCorretamente', () => {
        const excecao = new UriDocumentoInvalidaExcecao();

        expect(excecao.message).toBe('URI do documento não pode ser vazia.');
    });

    test('Construtor_SemParametros_DefineNameComoUriDocumentoInvalidaExcecao', () => {
        const excecao = new UriDocumentoInvalidaExcecao();

        expect(excecao.name).toBe('UriDocumentoInvalidaExcecao');
    });

    test('Instancia_UriDocumentoInvalidaExcecao_EhInstanceofEntradaInvalidaExcecao', () => {
        const excecao = new UriDocumentoInvalidaExcecao();

        expect(excecao).toBeInstanceOf(EntradaInvalidaExcecao);
    });

    test('Instancia_UriDocumentoInvalidaExcecao_EhInstanceofYamlExtensaoExcecao', () => {
        const excecao = new UriDocumentoInvalidaExcecao();

        expect(excecao).toBeInstanceOf(YamlExtensaoExcecao);
    });

    test('Instancia_UriDocumentoInvalidaExcecao_EhInstanceofError', () => {
        const excecao = new UriDocumentoInvalidaExcecao();

        expect(excecao).toBeInstanceOf(Error);
    });
});
