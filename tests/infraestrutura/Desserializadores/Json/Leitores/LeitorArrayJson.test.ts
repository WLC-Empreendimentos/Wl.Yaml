import { LeitorArrayJson } from '../../../../../src/infraestrutura/Desserializadores/Json/Leitores/LeitorArrayJson';
import { CampoArrayInvalidoExcecao } from '../../../../../src/nucleo/Excecoes/Perfil/CampoArrayInvalidoExcecao';

const CONTEXTO = 'arquivo de perfil';

describe('LeitorArrayJsonTest', () => {
    it('Ler_CampoArray_RetornaValor', () => {
        const resultado = LeitorArrayJson.Ler({ perfis: [1, 2] }, 'perfis', CONTEXTO);

        expect(resultado).toEqual([1, 2]);
    });

    it('Ler_CampoAusente_LancaCampoArrayInvalidoExcecao', () => {
        expect(() => LeitorArrayJson.Ler({}, 'perfis', CONTEXTO))
            .toThrow(CampoArrayInvalidoExcecao);
    });
});
