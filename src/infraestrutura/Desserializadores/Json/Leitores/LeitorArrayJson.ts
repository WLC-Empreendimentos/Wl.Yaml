import { ValidadorArrayJson } from '../Validadores/ValidadorArrayJson';

/**
 * Extrai um campo array de um objeto JSON validado.
 *
 * @remarks
 * Razão de mudança exclusiva: alteração na forma de extrair ou encaminhar
 * campos array de um objeto JSON — por exemplo, transformação do valor antes
 * de repassá-lo ao validador.
 */
export const LeitorArrayJson = {
    /**
     * Lê `obj[campo]` exigindo que seja um array.
     *
     * @param obj - Objeto JSON já validado como `Record<string, unknown>`.
     * @param campo - Nome do campo a extrair.
     * @param contexto - Descrição do local no documento, usada na mensagem de erro.
     * @returns O valor do campo como `unknown[]`.
     * @throws {CampoArrayInvalidoExcecao} Quando o campo está ausente ou não é um array.
     */
    Ler(obj: Record<string, unknown>, campo: string, contexto: string): unknown[] {
        return ValidadorArrayJson.Validar(obj[campo], contexto, campo);
    },
} as const;
