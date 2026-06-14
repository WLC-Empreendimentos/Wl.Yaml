import {
    ValidadorArrayJson,
} from '../../../../../src/infraestrutura/Desserializadores/Json/Validadores/ValidadorArrayJson';
import { CampoArrayInvalidoExcecao } from '../../../../../src/nucleo/Excecoes/Perfil/CampoArrayInvalidoExcecao';

const CONTEXTO = 'arquivo de perfil';
const CAMPO = 'perfis';

describe('ValidadorArrayJsonTest', () => {
    it('Validar_ValorArray_RetornaArray', () => {
        const resultado = ValidadorArrayJson.Validar([1, 2], CONTEXTO, CAMPO);

        expect(resultado).toEqual([1, 2]);
    });

    it('Validar_ArrayVazio_RetornaArrayVazio', () => {
        const resultado = ValidadorArrayJson.Validar([], CONTEXTO, CAMPO);

        expect(resultado).toEqual([]);
    });

    it('Validar_ValorAusente_LancaCampoArrayInvalidoExcecao', () => {
        expect(() => ValidadorArrayJson.Validar(undefined, CONTEXTO, CAMPO))
            .toThrow(CampoArrayInvalidoExcecao);
    });

    it('Validar_ValorString_LancaCampoArrayInvalidoExcecao', () => {
        expect(() => ValidadorArrayJson.Validar('errado', CONTEXTO, CAMPO))
            .toThrow(CampoArrayInvalidoExcecao);
    });

    it('Validar_ValorNumero_LancaCampoArrayInvalidoExcecao', () => {
        expect(() => ValidadorArrayJson.Validar(42, CONTEXTO, CAMPO))
            .toThrow(CampoArrayInvalidoExcecao);
    });

    it('Validar_ValorObjeto_LancaCampoArrayInvalidoExcecao', () => {
        expect(() => ValidadorArrayJson.Validar({}, CONTEXTO, CAMPO))
            .toThrow(CampoArrayInvalidoExcecao);
    });

    it('Validar_ValorNulo_LancaCampoArrayInvalidoExcecao', () => {
        expect(() => ValidadorArrayJson.Validar(null, CONTEXTO, CAMPO))
            .toThrow(CampoArrayInvalidoExcecao);
    });
});
