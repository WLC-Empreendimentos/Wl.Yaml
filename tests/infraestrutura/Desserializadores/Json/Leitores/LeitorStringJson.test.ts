import { LeitorStringJson } from '../../../../../src/infraestrutura/Desserializadores/Json/Leitores/LeitorStringJson';
import { CampoStringInvalidoExcecao } from '../../../../../src/nucleo/Excecoes/Perfil/CampoStringInvalidoExcecao';

const CONTEXTO = 'perfis[0]';

describe('LeitorStringJsonTest', () => {
    it('Ler_CampoString_RetornaValor', () => {
        const resultado = LeitorStringJson.Ler({ nome: 'yaml' }, 'nome', CONTEXTO);

        expect(resultado).toBe('yaml');
    });

    it('Ler_CampoAusente_LancaCampoStringInvalidoExcecao', () => {
        expect(() => LeitorStringJson.Ler({}, 'nome', CONTEXTO))
            .toThrow(CampoStringInvalidoExcecao);
    });
});
