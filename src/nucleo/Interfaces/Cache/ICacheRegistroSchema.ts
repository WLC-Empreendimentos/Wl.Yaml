import type { CancellationToken } from 'vscode';

/**
 * Contrato para persistência de schemas JSON remotos no cache.
 *
 * @remarks
 * Acionado após um download bem-sucedido de um schema (HTTP 200). O conteúdo
 * e o ETag são armazenados juntos porque são sempre produzidos na mesma
 * operação de rede e precisam permanecer consistentes entre si.
 */
export interface ICacheRegistroSchema {
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
}
