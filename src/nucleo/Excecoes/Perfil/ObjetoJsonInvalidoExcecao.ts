import { PerfilInvalidoExcecao } from './PerfilInvalidoExcecao';

/**
 * Exceção lançada quando um valor JSON bruto não é um objeto não-nulo.
 *
 * @remarks
 * Lançada pelo `ValidadorObjetoJson` ao receber `null`, `undefined`,
 * primitivos ou arrays no lugar de um objeto de campos esperado.
 */
export class ObjetoJsonInvalidoExcecao extends PerfilInvalidoExcecao {
    /**
     * @param contexto - Descrição do local no documento onde a validação falhou.
     */
    constructor(contexto: string) {
        super(`${contexto} deve ser um objeto`);
    }
}
