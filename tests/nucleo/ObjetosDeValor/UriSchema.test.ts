import { UriSchema } from '../../../src/nucleo/ObjetosDeValor/UriSchema';
import { UriSchemaInvalidaExcecao } from '../../../src/nucleo/Excecoes/Schema/UriSchemaInvalidaExcecao';

describe('UriSchemaTest', () => {
    test('Construtor_UriValida_ArmazenaValor', () => {
        const uri = new UriSchema('https://json.schemastore.org/github-workflow');

        expect(uri.Valor).toBe('https://json.schemastore.org/github-workflow');
    });

    test('Construtor_StringVazia_LancaUriSchemaInvalidaExcecao', () => {
        expect(() => new UriSchema('')).toThrow(UriSchemaInvalidaExcecao);
    });

    test('Construtor_StringSomenteEspacos_LancaUriSchemaInvalidaExcecao', () => {
        expect(() => new UriSchema('   ')).toThrow(UriSchemaInvalidaExcecao);
    });

    test('Construtor_StringVazia_MensagemDescreveMotivo', () => {
        expect(() => new UriSchema('')).toThrow('URI do schema não pode ser vazia.');
    });

    test('Iguala_MesmaUri_RetornaVerdadeiro', () => {
        const a = new UriSchema('https://json.schemastore.org/github-workflow');
        const b = new UriSchema('https://json.schemastore.org/github-workflow');

        expect(a.Iguala(b)).toBe(true);
    });

    test('Iguala_UrisDiferentes_RetornaFalso', () => {
        const a = new UriSchema('https://json.schemastore.org/github-workflow');
        const b = new UriSchema('https://json.schemastore.org/package');

        expect(a.Iguala(b)).toBe(false);
    });
});
