import { TipoAspas } from '../../../src/nucleo/Enums/TipoAspas';

describe('TipoAspasTest', () => {
    test('TipoAspas_Simples_TemValorSingle', () => {
        expect(TipoAspas.Simples).toBe('single');
    });

    test('TipoAspas_Duplas_TemValorDouble', () => {
        expect(TipoAspas.Duplas).toBe('double');
    });
});
