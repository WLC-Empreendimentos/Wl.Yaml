import {
    ValidadorModoQuebraJson,
} from '../../../../src/infraestrutura/Desserializadores/Perfil/ValidadorModoQuebraJson';
import { ModoQuebra } from '../../../../src/nucleo/Enums/ModoQuebra';
import { ModoQuebraInvalidoExcecao } from '../../../../src/nucleo/Excecoes/Perfil/ModoQuebraInvalidoExcecao';

const CONTEXTO = 'perfis[0]';

describe('ValidadorModoQuebraJsonTest', () => {
    it('Validar_Preserve_RetornaPreservar', () => {
        expect(ValidadorModoQuebraJson.Validar('preserve', CONTEXTO)).toBe(ModoQuebra.Preservar);
    });

    it('Validar_Never_RetornaNunca', () => {
        expect(ValidadorModoQuebraJson.Validar('never', CONTEXTO)).toBe(ModoQuebra.Nunca);
    });

    it('Validar_Always_RetornaSempre', () => {
        expect(ValidadorModoQuebraJson.Validar('always', CONTEXTO)).toBe(ModoQuebra.Sempre);
    });

    it('Validar_ValorDesconhecido_LancaModoQuebraInvalidoExcecao', () => {
        expect(() => ValidadorModoQuebraJson.Validar('auto', CONTEXTO))
            .toThrow(ModoQuebraInvalidoExcecao);
    });
});
