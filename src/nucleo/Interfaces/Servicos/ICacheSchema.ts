import type { CancellationToken } from 'vscode';

/**
 * Contrato para cache de conteúdo de schemas JSON remotos.
 *
 * @remarks
 * Evita requisições repetidas ao JSON Schema Store e a outros servidores
 * de schemas. O ETag permite validação HTTP condicional (304 Not Modified),
 * reaproveitando o conteúdo em cache quando o servidor confirma que não
 * houve alteração. Implementações podem usar disco ou VS Code Memento.
 */
export interface ICacheSchema {
    /**
     * Obtém o conteúdo em cache para a URI informada.
     *
     * @param uri - URI do schema remoto.
     * @param ct - Token de cancelamento da operação.
     * @returns Conteúdo do schema, ou `undefined` se ausente ou expirado.
     */
    ObterAsync(uri: string, ct: CancellationToken): Promise<string | undefined>;

    /**
     * Armazena o conteúdo do schema junto ao ETag para validação futura.
     *
     * @param uri - URI do schema remoto.
     * @param etag - Valor do cabeçalho `ETag` retornado pelo servidor.
     * @param conteudo - Conteúdo JSON do schema.
     * @param ct - Token de cancelamento da operação.
     */
    SalvarAsync(
        uri: string,
        etag: string,
        conteudo: string,
        ct: CancellationToken,
    ): Promise<void>;

    /**
     * Remove a entrada do cache para a URI informada.
     *
     * @param uri - URI do schema a invalidar.
     * @param ct - Token de cancelamento da operação.
     */
    InvalidarAsync(uri: string, ct: CancellationToken): Promise<void>;
}
