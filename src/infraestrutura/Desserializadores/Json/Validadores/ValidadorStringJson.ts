import { CampoStringInvalidoExcecao } from '../../../../nucleo/Excecoes/Perfil/CampoStringInvalidoExcecao';

/**
 * Valida que um valor JSON bruto é uma string.
 *
 * @remarks
 * Razão de mudança exclusiva: alteração na condição que determina se um valor
 * JSON é estruturalmente uma string — por exemplo, aceitação de valores numéricos
 * convertíveis a string.
 */
export const ValidadorStringJson = {
    /**
     * Converte `valor` para `string`, lançando se não for uma string.
     *
     * @param valor - Valor bruto extraído de um campo do JSON.
     * @param contexto - Descrição do local no documento, usada na mensagem de erro.
     * @param campo - Nome do campo validado, usado na mensagem de erro.
     * @returns O mesmo valor restringido ao tipo `string`.
     * @throws {CampoStringInvalidoExcecao} Quando `valor` não é uma string.
     */
    Validar(valor: unknown, contexto: string, campo: string): string {
        if (typeof valor !== 'string') {
            throw new CampoStringInvalidoExcecao(contexto, campo);
        }
        return valor;
    },
} as const;
