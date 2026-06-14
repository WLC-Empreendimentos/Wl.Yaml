import {
    ValidadorStringJson,
} from '../../../../../src/infraestrutura/Desserializadores/Json/Validadores/ValidadorStringJson';
import { CampoStringInvalidoExcecao } from '../../../../../src/nucleo/Excecoes/Perfil/CampoStringInvalidoExcecao';

const CONTEXTO = 'perfis[0]';
const CAMPO = 'padraoArquivo';

describe('ValidadorStringJsonTest', () => {
    it('Validar_ValorString_RetornaString', () => {
        const resultado = ValidadorStringJson.Validar('**/*.yaml', CONTEXTO, CAMPO);

        expect(resultado).toBe('**/*.yaml');
    });

    it('Validar_StringVazia_RetornaStringVazia', () => {
        const resultado = ValidadorStringJson.Validar('', CONTEXTO, CAMPO);

        expect(resultado).toBe('');
    });

    it('Validar_ValorAusente_LancaCampoStringInvalidoExcecao', () => {
        expect(() => ValidadorStringJson.Validar(undefined, CONTEXTO, CAMPO))
            .toThrow(CampoStringInvalidoExcecao);
    });

    it('Validar_ValorNumero_LancaCampoStringInvalidoExcecao', () => {
        expect(() => ValidadorStringJson.Validar(42, CONTEXTO, CAMPO))
            .toThrow(CampoStringInvalidoExcecao);
    });

    it('Validar_ValorBooleano_LancaCampoStringInvalidoExcecao', () => {
        expect(() => ValidadorStringJson.Validar(true, CONTEXTO, CAMPO))
            .toThrow(CampoStringInvalidoExcecao);
    });

    it('Validar_ValorArray_LancaCampoStringInvalidoExcecao', () => {
        expect(() => ValidadorStringJson.Validar([], CONTEXTO, CAMPO))
            .toThrow(CampoStringInvalidoExcecao);
    });

    it('Validar_ValorNulo_LancaCampoStringInvalidoExcecao', () => {
        expect(() => ValidadorStringJson.Validar(null, CONTEXTO, CAMPO))
            .toThrow(CampoStringInvalidoExcecao);
    });
});
