import { PerfilInvalidoExcecao } from './PerfilInvalidoExcecao';

/**
 * Exceção lançada quando o valor do campo `modoQuebra` não corresponde a nenhum modo conhecido.
 *
 * @remarks
 * Lançada pelo `ModoQuebraDesserializador` ao receber um valor não mapeado.
 * Valores aceitos: `"preserve"`, `"never"`, `"always"`.
 */
export class ModoQuebraInvalidoExcecao extends PerfilInvalidoExcecao {
    /**
     * @param contexto - Descrição do local no documento (ex: `"perfis[0]"`).
     * @param valor - Valor recebido que não corresponde a nenhum modo de quebra válido.
     */
    constructor(contexto: string, valor: string) {
        super(`${contexto}.modoQuebra valor inválido: "${valor}"`);
    }
}
