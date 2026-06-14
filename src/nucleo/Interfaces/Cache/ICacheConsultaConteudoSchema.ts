import type { CancellationToken } from 'vscode';

/**
 * Contrato para leitura do conteúdo em cache de um schema JSON remoto.
 *
 * @remarks
 * Consultado pelo fetcher de schemas antes de iniciar qualquer requisição HTTP,
 * para verificar se o conteúdo já está disponível localmente. Separado de
 * `ICacheConsultaEtagSchema` pois o consumidor do conteúdo e o consumidor do
 * ETag são contextos distintos — um renderiza o schema, o outro monta o header
 * `If-None-Match`.
 */
export interface ICacheConsultaConteudoSchema {
    /**
     * Obtém o conteúdo JSON em cache para a URI informada.
     *
     * @param uri - URI do schema remoto.
     * @param ct - Token de cancelamento da operação.
     * @returns Conteúdo do schema, ou `undefined` se a URI não estiver em cache.
     */
    ObterAsync(uri: string, ct: CancellationToken): Promise<string | undefined>;
}
