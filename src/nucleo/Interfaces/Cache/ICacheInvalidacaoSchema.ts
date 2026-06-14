import type { CancellationToken } from 'vscode';

/**
 * Contrato para invalidação de entradas do cache de schemas JSON.
 *
 * @remarks
 * Acionado quando o schema é alterado no servidor e a entrada em cache deixa
 * de ser válida, forçando o próximo acesso a buscar o conteúdo atualizado.
 * Separado dos contratos de consulta e registro pois a estratégia de
 * invalidação pode evoluir independentemente (por TTL, webhook, versionamento).
 */
export interface ICacheInvalidacaoSchema {
    /**
     * Remove a entrada do cache para a URI informada.
     *
     * @param uri - URI do schema a invalidar.
     * @param ct - Token de cancelamento da operação.
     */
    InvalidarAsync(uri: string, ct: CancellationToken): Promise<void>;
}
