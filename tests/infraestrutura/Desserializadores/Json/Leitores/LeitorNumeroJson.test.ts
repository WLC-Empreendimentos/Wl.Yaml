import { LeitorNumeroJson } from '../../../../../src/infraestrutura/Desserializadores/Json/Leitores/LeitorNumeroJson';
import { CampoNumeroInvalidoExcecao } from '../../../../../src/nucleo/Excecoes/Perfil/CampoNumeroInvalidoExcecao';

const CONTEXTO = 'perfis[0]';

describe('LeitorNumeroJsonTest', () => {
    it('Ler_CampoNumero_RetornaValor', () => {
        const resultado = LeitorNumeroJson.Ler({ tamanho: 4 }, 'tamanho', CONTEXTO);

        expect(resultado).toBe(4);
    });

    it('Ler_CampoAusente_LancaCampoNumeroInvalidoExcecao', () => {
        expect(() => LeitorNumeroJson.Ler({}, 'tamanho', CONTEXTO))
            .toThrow(CampoNumeroInvalidoExcecao);
    });
});
