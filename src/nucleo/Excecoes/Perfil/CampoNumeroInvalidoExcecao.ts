import { PerfilInvalidoExcecao } from './PerfilInvalidoExcecao';

/**
 * Exceção lançada quando um campo JSON esperado como `number` está ausente ou tem tipo diferente.
 *
 * @remarks
 * Lançada pelo `LeitorNumeroJson` ao encontrar `null`, `undefined`, string
 * ou array no lugar de um número no campo solicitado.
 */
export class CampoNumeroInvalidoExcecao extends PerfilInvalidoExcecao {
    /**
     * @param contexto - Descrição do local no documento (ex: `"perfis[0]"`).
     * @param campo - Nome do campo que falhou na validação.
     */
    constructor(contexto: string, campo: string) {
        super(`${contexto}.${campo} deve ser um número`);
    }
}
