import type { CancellationToken, Memento } from 'vscode';
import type { ICacheRegistroSchema } from '../../nucleo/Interfaces/Cache/ICacheRegistroSchema';

const PREFIXO = 'wl-yaml.cache-schema.';

interface EntradaCache {
    etag: string;
    conteudo: string;
}

/**
 * Persiste schemas JSON remotos no VS Code Memento junto ao ETag.
 *
 * @remarks
 * Chamado após um download HTTP 200 bem-sucedido. O conteúdo e o ETag são
 * armazenados na mesma entrada porque são sempre produzidos juntos e precisam
 * permanecer consistentes — um ETag sem conteúdo associado não tem significado.
 */
export class CacheRegistroSchemaMementoVsCode implements ICacheRegistroSchema {
    private readonly _memento: Memento;

    /**
     * @param memento - Memento global da extensão (`context.globalState`).
     */
    constructor(memento: Memento) {
        this._memento = memento;
    }

    /**
     * Armazena o conteúdo do schema junto ao ETag para validação futura.
     *
     * @param uri - URI do schema remoto.
     * @param etag - Valor do cabeçalho `ETag` retornado pelo servidor.
     * @param conteudo - Conteúdo JSON do schema.
     * @param _ct - Token de cancelamento (não utilizado — a API de Memento não o suporta).
     */
    async SalvarAsync(uri: string, etag: string, conteudo: string, _ct: CancellationToken): Promise<void> {
        await this._memento.update(PREFIXO + uri, { etag, conteudo } satisfies EntradaCache);
    }
}
