import type { ModoQuebra } from '../../../nucleo/Enums/ModoQuebra';
import { ValidadorModoQuebraJson } from './ValidadorModoQuebraJson';

/**
 * Converte o valor string do campo `modoQuebra` do `.yaml-profile.json` para `ModoQuebra`.
 *
 * @remarks
 * Razão de mudança exclusiva: alteração na forma de orquestrar a conversão do
 * campo `modoQuebra` — por exemplo, pré-processamento do valor antes da validação.
 */
export const ModoQuebraDesserializador = {
    /**
     * Converte um valor string para o enum `ModoQuebra`.
     *
     * @param valor - String lida do JSON (ex: `"preserve"`, `"never"`, `"always"`).
     * @param contexto - Descrição do local no documento, usada na mensagem de erro.
     * @returns Valor do enum correspondente.
     * @throws {ModoQuebraInvalidoExcecao} Quando o valor não corresponde a nenhum modo conhecido.
     */
    Desserializar(valor: string, contexto: string): ModoQuebra {
        return ValidadorModoQuebraJson.Validar(valor, contexto);
    },
} as const;
