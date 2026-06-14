import { ValidadorStringJson } from '../Validadores/ValidadorStringJson';

/**
 * Extrai campos obrigatórios do tipo `string` de objetos JSON brutos.
 *
 * @remarks
 * Razão de mudança exclusiva: alteração na forma de extrair ou encaminhar
 * campos string de um objeto JSON — por exemplo, normalização de espaços
 * antes de repassar o valor ao validador.
 */
export const LeitorStringJson = {
    /**
     * Lê um campo obrigatório do tipo `string`.
     *
     * @param obj - Objeto JSON já validado como `Record<string, unknown>`.
     * @param campo - Nome do campo a ler.
     * @param contexto - Descrição do local no documento, usada na mensagem de erro.
     * @returns Valor do campo como `string`.
     * @throws {CampoStringInvalidoExcecao} Quando o campo está ausente ou não é uma string.
     */
    Ler(obj: Record<string, unknown>, campo: string, contexto: string): string {
        return ValidadorStringJson.Validar(obj[campo], contexto, campo);
    },
} as const;
