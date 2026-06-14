import { PerfilInvalidoExcecao } from './PerfilInvalidoExcecao';

/**
 * Exceção lançada quando um campo JSON esperado como `string` está ausente ou tem tipo diferente.
 *
 * @remarks
 * Lançada pelo `LeitorStringJson` ao encontrar `null`, `undefined`, número
 * ou array no lugar de uma string no campo solicitado.
 */
export class CampoStringInvalidoExcecao extends PerfilInvalidoExcecao {
    /**
     * @param contexto - Descrição do local no documento (ex: `"perfis[0]"`).
     * @param campo - Nome do campo que falhou na validação.
     */
    constructor(contexto: string, campo: string) {
        super(`${contexto}.${campo} deve ser uma string`);
    }
}
