import {
    TipoAspasDesserializador,
} from '../../../../src/infraestrutura/Desserializadores/Perfil/TipoAspasDesserializador';
import { TipoAspas } from '../../../../src/nucleo/Enums/TipoAspas';
import { TipoAspasInvalidoExcecao } from '../../../../src/nucleo/Excecoes/Perfil/TipoAspasInvalidoExcecao';

const CONTEXTO = 'perfis[0]';

describe('TipoAspasDesserializadorTest', () => {
    it('Desserializar_Single_RetornaAspasSimples', () => {
        expect(TipoAspasDesserializador.Desserializar('single', CONTEXTO)).toBe(TipoAspas.Simples);
    });

    it('Desserializar_ValorDesconhecido_LancaTipoAspasInvalidoExcecao', () => {
        expect(() => TipoAspasDesserializador.Desserializar('backtick', CONTEXTO))
            .toThrow(TipoAspasInvalidoExcecao);
    });
});
