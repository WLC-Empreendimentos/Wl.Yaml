import { PerfilInvalidoExcecao } from './PerfilInvalidoExcecao';

/**
 * Exceção lançada quando o valor do campo `tipoAspas` não corresponde a nenhum tipo conhecido.
 *
 * @remarks
 * Lançada pelo `TipoAspasDesserializador` ao receber um valor não mapeado.
 * Valores aceitos: `"single"`, `"double"`.
 */
export class TipoAspasInvalidoExcecao extends PerfilInvalidoExcecao {
    /**
     * @param contexto - Descrição do local no documento (ex: `"perfis[0]"`).
     * @param valor - Valor recebido que não corresponde a nenhum tipo de aspas válido.
     */
    constructor(contexto: string, valor: string) {
        super(`${contexto}.tipoAspas valor inválido: "${valor}"`);
    }
}
