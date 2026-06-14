import { TipoAspas } from '../../../nucleo/Enums/TipoAspas';
import { TipoAspasInvalidoExcecao } from '../../../nucleo/Excecoes/Perfil/TipoAspasInvalidoExcecao';

const MAPA: Readonly<Record<string, TipoAspas>> = {
    single: TipoAspas.Simples,
    double: TipoAspas.Duplas,
};

/**
 * Valida que uma string JSON corresponde a um valor conhecido de `TipoAspas`.
 *
 * @remarks
 * Razão de mudança exclusiva: alteração nos valores de string aceitos pelo
 * yaml-language-server para o parâmetro de aspas de formatação.
 */
export const ValidadorTipoAspasJson = {
    /**
     * Converte `valor` para `TipoAspas`, lançando se não for um valor conhecido.
     *
     * @param valor - String lida do JSON (ex: `"single"`, `"double"`).
     * @param contexto - Descrição do local no documento, usada na mensagem de erro.
     * @returns Valor do enum correspondente.
     * @throws {TipoAspasInvalidoExcecao} Quando o valor não corresponde a nenhum tipo conhecido.
     */
    Validar(valor: string, contexto: string): TipoAspas {
        const tipoAspas = MAPA[valor];
        if (tipoAspas === undefined) {
            throw new TipoAspasInvalidoExcecao(contexto, valor);
        }
        return tipoAspas;
    },
} as const;
