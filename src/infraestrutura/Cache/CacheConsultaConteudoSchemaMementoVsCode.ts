import type { CancellationToken, Memento } from 'vscode';
import type { ICacheConsultaConteudoSchema } from '../../nucleo/Interfaces/Cache/ICacheConsultaConteudoSchema';

const PREFIXO = 'wl-yaml.cache-schema.';

interface EntradaCache {
    etag: string;
    conteudo: string;
}

/**
 * Lê o conteúdo de schemas JSON remotos a partir do VS Code Memento.
 *
 * @remarks
 * Consultado antes de iniciar qualquer requisição HTTP para verificar se o
 * conteúdo já está disponível localmente. A entrada existe enquanto
 * `CacheRegistroSchemaMementoVsCode` não for substituída por uma nova versão
 * e `CacheInvalidacaoSchemaMementoVsCode` não remover a chave.
 */
export class CacheConsultaConteudoSchemaMementoVsCode implements ICacheConsultaConteudoSchema {
    private readonly _memento: Memento;

    /**
     * @param memento - Memento global da extensão (`context.globalState`).
     */
    constructor(memento: Memento) {
        this._memento = memento;
    }

    /**
     * Obtém o conteúdo JSON em cache para a URI informada.
     *
     * @param uri - URI do schema remoto.
     * @param _ct - Token de cancelamento (não utilizado — leitura síncrona do Memento).
     * @returns Conteúdo do schema, ou `undefined` se a URI não estiver em cache.
     */
    ObterAsync(uri: string, _ct: CancellationToken): Promise<string | undefined> {
        const entrada = this._memento.get<EntradaCache>(PREFIXO + uri);
        return Promise.resolve(entrada?.conteudo);
    }
}
