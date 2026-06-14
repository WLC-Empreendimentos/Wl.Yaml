import type { TipoAspas } from '../../../nucleo/Enums/TipoAspas';
import { ValidadorTipoAspasJson } from './ValidadorTipoAspasJson';

/**
 * Converte o valor string do campo `tipoAspas` do `.yaml-profile.json` para `TipoAspas`.
 *
 * @remarks
 * Razão de mudança exclusiva: alteração na forma de orquestrar a conversão do
 * campo `tipoAspas` — por exemplo, pré-processamento do valor antes da validação.
 */
export const TipoAspasDesserializador = {
    /**
     * Converte um valor string para o enum `TipoAspas`.
     *
     * @param valor - String lida do JSON (ex: `"single"`, `"double"`).
     * @param contexto - Descrição do local no documento, usada na mensagem de erro.
     * @returns Valor do enum correspondente.
     * @throws {TipoAspasInvalidoExcecao} Quando o valor não corresponde a nenhum tipo conhecido.
     */
    Desserializar(valor: string, contexto: string): TipoAspas {
        return ValidadorTipoAspasJson.Validar(valor, contexto);
    },
} as const;
