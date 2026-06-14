import { CampoNumeroInvalidoExcecao } from '../../../../nucleo/Excecoes/Perfil/CampoNumeroInvalidoExcecao';

/**
 * Valida que um valor JSON bruto é um número.
 *
 * @remarks
 * Razão de mudança exclusiva: alteração na condição que determina se um valor
 * JSON é estruturalmente um número — por exemplo, rejeição de `NaN` ou `Infinity`.
 */
export const ValidadorNumeroJson = {
    /**
     * Converte `valor` para `number`, lançando se não for um número.
     *
     * @param valor - Valor bruto extraído de um campo do JSON.
     * @param contexto - Descrição do local no documento, usada na mensagem de erro.
     * @param campo - Nome do campo validado, usado na mensagem de erro.
     * @returns O mesmo valor restringido ao tipo `number`.
     * @throws {CampoNumeroInvalidoExcecao} Quando `valor` não é um número.
     */
    Validar(valor: unknown, contexto: string, campo: string): number {
        if (typeof valor !== 'number') {
            throw new CampoNumeroInvalidoExcecao(contexto, campo);
        }
        return valor;
    },
} as const;
