import { ObjetoJsonInvalidoExcecao } from '../../../../nucleo/Excecoes/Perfil/ObjetoJsonInvalidoExcecao';

/**
 * Valida que um valor JSON bruto é um objeto não-nulo e o converte para acesso por chave.
 *
 * @remarks
 * Razão de mudança exclusiva: alteração na condição que determina se um valor
 * JSON bruto é estruturalmente um objeto de campos — por exemplo, se arrays
 * passarem a ser aceitos como estrutura raiz de um perfil.
 */
export const ValidadorObjetoJson = {
    /**
     * Converte `raw` para `Record<string, unknown>`, lançando se não for um objeto.
     *
     * @param raw - Valor bruto do JSON.
     * @param contexto - Descrição do local no documento, usada na mensagem de erro.
     * @returns O mesmo valor restringido ao tipo `Record<string, unknown>`.
     * @throws {ObjetoJsonInvalidoExcecao} Quando `raw` não é um objeto não-nulo.
     */
    Validar(raw: unknown, contexto: string): Record<string, unknown> {
        if (typeof raw !== 'object' || raw === null) {
            throw new ObjetoJsonInvalidoExcecao(contexto);
        }
        return raw as Record<string, unknown>;
    },
} as const;
