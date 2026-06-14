import {
    ValidadorObjetoJson,
} from '../../../../../src/infraestrutura/Desserializadores/Json/Validadores/ValidadorObjetoJson';
import { PerfilInvalidoExcecao } from '../../../../../src/nucleo/Excecoes/Perfil/PerfilInvalidoExcecao';

const POS = '0';

describe('ValidadorObjetoJsonTest', () => {
    it('Validar_ObjetoValido_RetornaRegistro', () => {
        const obj = { campo: 'valor' };

        const resultado = ValidadorObjetoJson.Validar(obj, POS);

        expect(resultado).toBe(obj);
    });

    it('Validar_Nulo_LancaPerfilInvalidoExcecao', () => {
        expect(() => ValidadorObjetoJson.Validar(null, POS))
            .toThrow(PerfilInvalidoExcecao);
    });

    it('Validar_Numero_LancaPerfilInvalidoExcecao', () => {
        expect(() => ValidadorObjetoJson.Validar(42, POS))
            .toThrow(PerfilInvalidoExcecao);
    });
});
