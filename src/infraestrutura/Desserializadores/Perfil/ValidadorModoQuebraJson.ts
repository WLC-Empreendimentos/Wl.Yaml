import { ModoQuebra } from '../../../nucleo/Enums/ModoQuebra';
import { ModoQuebraInvalidoExcecao } from '../../../nucleo/Excecoes/Perfil/ModoQuebraInvalidoExcecao';

const MAPA: Readonly<Record<string, ModoQuebra>> = {
    preserve: ModoQuebra.Preservar,
    never: ModoQuebra.Nunca,
    always: ModoQuebra.Sempre,
};

/**
 * Valida que uma string JSON corresponde a um valor conhecido de `ModoQuebra`.
 *
 * @remarks
 * Razão de mudança exclusiva: alteração nos valores de string aceitos pelo
 * yaml-language-server para o parâmetro `proseWrap` de formatação.
 */
export const ValidadorModoQuebraJson = {
    /**
     * Converte `valor` para `ModoQuebra`, lançando se não for um valor conhecido.
     *
     * @param valor - String lida do JSON (ex: `"preserve"`, `"never"`, `"always"`).
     * @param contexto - Descrição do local no documento, usada na mensagem de erro.
     * @returns Valor do enum correspondente.
     * @throws {ModoQuebraInvalidoExcecao} Quando o valor não corresponde a nenhum modo conhecido.
     */
    Validar(valor: string, contexto: string): ModoQuebra {
        const modoQuebra = MAPA[valor];
        if (modoQuebra === undefined) {
            throw new ModoQuebraInvalidoExcecao(contexto, valor);
        }
        return modoQuebra;
    },
} as const;
