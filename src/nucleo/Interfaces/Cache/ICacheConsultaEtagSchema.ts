import type { CancellationToken } from 'vscode';

/**
 * Contrato para leitura do ETag em cache de um schema JSON remoto.
 *
 * @remarks
 * O ETag é necessário para construir o header `If-None-Match` em requisições
 * HTTP condicionais (RFC 7232). Com ele, o servidor pode responder 304 Not
 * Modified, evitando a transferência do conteúdo quando o schema não mudou.
 * Separado de `ICacheConsultaConteudoSchema` pois leitura de ETag e leitura
 * de conteúdo são usadas em momentos e contextos distintos.
 */
export interface ICacheConsultaEtagSchema {
    /**
     * Obtém o ETag armazenado para a URI informada.
     *
     * @param uri - URI do schema remoto.
     * @param ct - Token de cancelamento da operação.
     * @returns Valor do ETag, ou `undefined` se a URI não estiver em cache.
     */
    ObterAsync(uri: string, ct: CancellationToken): Promise<string | undefined>;
}
