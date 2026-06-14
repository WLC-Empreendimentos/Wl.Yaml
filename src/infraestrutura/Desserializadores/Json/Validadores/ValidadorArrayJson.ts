import { CampoArrayInvalidoExcecao } from '../../../../nucleo/Excecoes/Perfil/CampoArrayInvalidoExcecao';

/**
 * Valida que um valor JSON bruto é um array e o converte para `unknown[]`.
 *
 * @remarks
 * Razão de mudança exclusiva: alteração na condição que determina se um valor
 * JSON é estruturalmente um array — por exemplo, se outros tipos iteráveis
 * passarem a ser aceitos como campo de coleção.
 */
export const ValidadorArrayJson = {
    /**
     * Converte `valor` para `unknown[]`, lançando se não for um array.
     *
     * @param valor - Valor bruto extraído de um campo do JSON.
     * @param contexto - Descrição do local no documento, usada na mensagem de erro.
     * @param campo - Nome do campo validado, usado na mensagem de erro.
     * @returns O mesmo valor restringido ao tipo `unknown[]`.
     * @throws {CampoArrayInvalidoExcecao} Quando `valor` não é um array.
     */
    Validar(valor: unknown, contexto: string, campo: string): unknown[] {
        if (!Array.isArray(valor)) {
            throw new CampoArrayInvalidoExcecao(contexto, campo);
        }
        return valor;
    },
} as const;
