import { UriSchemaValidador } from '../../../src/nucleo/Validadores/UriSchemaValidador';
import { UriSchemaInvalidaExcecao } from '../../../src/nucleo/Excecoes/Schema/UriSchemaInvalidaExcecao';

describe('UriSchemaValidadorTest', () => {
    test('Validar_UriValida_NaoLancaExcecao', () => {
        expect(() => UriSchemaValidador.Validar('https://json.schemastore.org/github-workflow')).not.toThrow();
    });

    test('Validar_StringVazia_LancaUriSchemaInvalidaExcecao', () => {
        expect(() => UriSchemaValidador.Validar('')).toThrow(UriSchemaInvalidaExcecao);
    });

    test('Validar_StringSomenteEspacos_LancaUriSchemaInvalidaExcecao', () => {
        expect(() => UriSchemaValidador.Validar('   ')).toThrow(UriSchemaInvalidaExcecao);
    });
});
