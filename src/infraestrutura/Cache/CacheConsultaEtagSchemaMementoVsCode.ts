import type { CancellationToken, Memento } from 'vscode';
import type { ICacheConsultaEtagSchema } from '../../nucleo/Interfaces/Cache/ICacheConsultaEtagSchema';

const PREFIXO = 'wl-yaml.cache-schema.';

interface EntradaCache {
    etag: string;
    conteudo: string;
}

/**
 * Lê o ETag de schemas JSON remotos a partir do VS Code Memento.
 *
 * @remarks
 * O ETag é retornado ao fetcher para montar o header `If-None-Match` em
 * requisições HTTP condicionais, permitindo que o servidor responda 304 Not
 * Modified quando o schema não foi alterado desde o último download.
 */
export class CacheConsultaEtagSchemaMementoVsCode implements ICacheConsultaEtagSchema {
    private readonly _memento: Memento;

    /**
     * @param memento - Memento global da extensão (`context.globalState`).
     */
    constructor(memento: Memento) {
        this._memento = memento;
    }

    /**
     * Obtém o ETag armazenado para a URI informada.
     *
     * @param uri - URI do schema remoto.
     * @param _ct - Token de cancelamento (não utilizado — leitura síncrona do Memento).
     * @returns Valor do ETag, ou `undefined` se a URI não estiver em cache.
     */
    ObterAsync(uri: string, _ct: CancellationToken): Promise<string | undefined> {
        const entrada = this._memento.get<EntradaCache>(PREFIXO + uri);
        return Promise.resolve(entrada?.etag);
    }
}
