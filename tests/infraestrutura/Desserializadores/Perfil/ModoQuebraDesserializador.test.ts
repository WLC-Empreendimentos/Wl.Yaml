import {
    ModoQuebraDesserializador,
} from '../../../../src/infraestrutura/Desserializadores/Perfil/ModoQuebraDesserializador';
import { ModoQuebra } from '../../../../src/nucleo/Enums/ModoQuebra';
import { ModoQuebraInvalidoExcecao } from '../../../../src/nucleo/Excecoes/Perfil/ModoQuebraInvalidoExcecao';

const CONTEXTO = 'perfis[0]';

describe('ModoQuebraDesserializadorTest', () => {
    it('Desserializar_Preserve_RetornaPreservar', () => {
        expect(ModoQuebraDesserializador.Desserializar('preserve', CONTEXTO)).toBe(ModoQuebra.Preservar);
    });

    it('Desserializar_ValorDesconhecido_LancaModoQuebraInvalidoExcecao', () => {
        expect(() => ModoQuebraDesserializador.Desserializar('auto', CONTEXTO))
            .toThrow(ModoQuebraInvalidoExcecao);
    });
});
