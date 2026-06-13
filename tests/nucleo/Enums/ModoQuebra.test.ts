import { ModoQuebra } from '../../../src/nucleo/Enums/ModoQuebra';

describe('ModoQuebraTest', () => {
    test('ModoQuebra_Preservar_TemValorPreserve', () => {
        expect(ModoQuebra.Preservar).toBe('preserve');
    });

    test('ModoQuebra_Nunca_TemValorNever', () => {
        expect(ModoQuebra.Nunca).toBe('never');
    });

    test('ModoQuebra_Sempre_TemValorAlways', () => {
        expect(ModoQuebra.Sempre).toBe('always');
    });
});
