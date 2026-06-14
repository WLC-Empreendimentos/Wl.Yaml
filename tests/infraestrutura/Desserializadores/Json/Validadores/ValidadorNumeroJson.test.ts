import {
    ValidadorNumeroJson,
} from '../../../../../src/infraestrutura/Desserializadores/Json/Validadores/ValidadorNumeroJson';
import { CampoNumeroInvalidoExcecao } from '../../../../../src/nucleo/Excecoes/Perfil/CampoNumeroInvalidoExcecao';

const CONTEXTO = 'perfis[0]';
const CAMPO = 'tamanhoIndentacao';

describe('ValidadorNumeroJsonTest', () => {
    it('Validar_ValorNumero_RetornaNumero', () => {
        const resultado = ValidadorNumeroJson.Validar(4, CONTEXTO, CAMPO);

        expect(resultado).toBe(4);
    });

    it('Validar_ValorZero_RetornaZero', () => {
        const resultado = ValidadorNumeroJson.Validar(0, CONTEXTO, CAMPO);

        expect(resultado).toBe(0);
    });

    it('Validar_ValorAusente_LancaCampoNumeroInvalidoExcecao', () => {
        expect(() => ValidadorNumeroJson.Validar(undefined, CONTEXTO, CAMPO))
            .toThrow(CampoNumeroInvalidoExcecao);
    });

    it('Validar_ValorString_LancaCampoNumeroInvalidoExcecao', () => {
        expect(() => ValidadorNumeroJson.Validar('dois', CONTEXTO, CAMPO))
            .toThrow(CampoNumeroInvalidoExcecao);
    });

    it('Validar_ValorBooleano_LancaCampoNumeroInvalidoExcecao', () => {
        expect(() => ValidadorNumeroJson.Validar(true, CONTEXTO, CAMPO))
            .toThrow(CampoNumeroInvalidoExcecao);
    });

    it('Validar_ValorArray_LancaCampoNumeroInvalidoExcecao', () => {
        expect(() => ValidadorNumeroJson.Validar([], CONTEXTO, CAMPO))
            .toThrow(CampoNumeroInvalidoExcecao);
    });

    it('Validar_ValorNulo_LancaCampoNumeroInvalidoExcecao', () => {
        expect(() => ValidadorNumeroJson.Validar(null, CONTEXTO, CAMPO))
            .toThrow(CampoNumeroInvalidoExcecao);
    });
});
