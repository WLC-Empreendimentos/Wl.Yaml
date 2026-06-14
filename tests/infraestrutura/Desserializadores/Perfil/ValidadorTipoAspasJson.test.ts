import {
    ValidadorTipoAspasJson,
} from '../../../../src/infraestrutura/Desserializadores/Perfil/ValidadorTipoAspasJson';
import { TipoAspas } from '../../../../src/nucleo/Enums/TipoAspas';
import { TipoAspasInvalidoExcecao } from '../../../../src/nucleo/Excecoes/Perfil/TipoAspasInvalidoExcecao';

const CONTEXTO = 'perfis[0]';

describe('ValidadorTipoAspasJsonTest', () => {
    it('Validar_Single_RetornaAspasSimples', () => {
        expect(ValidadorTipoAspasJson.Validar('single', CONTEXTO)).toBe(TipoAspas.Simples);
    });

    it('Validar_Double_RetornaAspasDuplas', () => {
        expect(ValidadorTipoAspasJson.Validar('double', CONTEXTO)).toBe(TipoAspas.Duplas);
    });

    it('Validar_ValorDesconhecido_LancaTipoAspasInvalidoExcecao', () => {
        expect(() => ValidadorTipoAspasJson.Validar('backtick', CONTEXTO))
            .toThrow(TipoAspasInvalidoExcecao);
    });
});
