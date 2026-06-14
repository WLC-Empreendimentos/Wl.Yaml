import { PerfilInvalidoExcecao } from './PerfilInvalidoExcecao';

/**
 * Exceção lançada quando um campo JSON esperado como array está ausente ou tem tipo diferente.
 *
 * @remarks
 * Lançada pelo `LeitorArrayJson` ao encontrar `null`, `undefined`, string
 * ou objeto no lugar de um array no campo solicitado.
 */
export class CampoArrayInvalidoExcecao extends PerfilInvalidoExcecao {
    /**
     * @param contexto - Descrição do local no documento (ex: `"arquivo de perfil"`).
     * @param campo - Nome do campo que falhou na validação.
     */
    constructor(contexto: string, campo: string) {
        super(`${contexto}.${campo} deve ser um array`);
    }
}
