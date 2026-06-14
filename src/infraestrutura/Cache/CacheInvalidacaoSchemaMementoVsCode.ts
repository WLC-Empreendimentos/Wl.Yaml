import type { CancellationToken, Memento } from 'vscode';
import type { ICacheInvalidacaoSchema } from '../../nucleo/Interfaces/Cache/ICacheInvalidacaoSchema';

const PREFIXO = 'wl-yaml.cache-schema.';

/**
 * Remove entradas do cache de schemas JSON no VS Code Memento.
 *
 * @remarks
 * Acionado quando o schema é alterado no servidor e o conteúdo em cache
 * deixa de ser válido. Ao remover a entrada, a próxima consulta ao
 * `CacheConsultaConteudoSchemaMementoVsCode` retornará `undefined`, forçando
 * o fetcher a buscar o conteúdo atualizado.
 */
export class CacheInvalidacaoSchemaMementoVsCode implements ICacheInvalidacaoSchema {
    private readonly _memento: Memento;

    /**
     * @param memento - Memento global da extensão (`context.globalState`).
     */
    constructor(memento: Memento) {
        this._memento = memento;
    }

    /**
     * Remove a entrada do cache para a URI informada.
     *
     * @param uri - URI do schema a invalidar.
     * @param _ct - Token de cancelamento (não utilizado — a API de Memento não o suporta).
     */
    async InvalidarAsync(uri: string, _ct: CancellationToken): Promise<void> {
        await this._memento.update(PREFIXO + uri, undefined);
    }
}
