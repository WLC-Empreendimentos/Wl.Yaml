import { ValidadorNumeroJson } from '../Validadores/ValidadorNumeroJson';

/**
 * Extrai campos obrigatórios do tipo `number` de objetos JSON brutos.
 *
 * @remarks
 * Razão de mudança exclusiva: alteração na forma de extrair ou encaminhar
 * campos numéricos de um objeto JSON — por exemplo, arredondamento do valor
 * antes de repassá-lo ao validador.
 */
export const LeitorNumeroJson = {
    /**
     * Lê um campo obrigatório do tipo `number`.
     *
     * @param obj - Objeto JSON já validado como `Record<string, unknown>`.
     * @param campo - Nome do campo a ler.
     * @param contexto - Descrição do local no documento, usada na mensagem de erro.
     * @returns Valor do campo como `number`.
     * @throws {CampoNumeroInvalidoExcecao} Quando o campo está ausente ou não é um número.
     */
    Ler(obj: Record<string, unknown>, campo: string, contexto: string): number {
        return ValidadorNumeroJson.Validar(obj[campo], contexto, campo);
    },
} as const;
