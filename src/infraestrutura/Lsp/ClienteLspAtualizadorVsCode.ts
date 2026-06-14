import type { CancellationToken } from 'vscode';
import type { BaseLanguageClient } from 'vscode-languageclient';
import type { IClienteLspAtualizador } from '../../nucleo/Interfaces/Servicos/IClienteLspAtualizador';
import type { AssociacaoSchema } from '../../nucleo/Entidades/AssociacaoSchema';
import { SerializadorAssociacoesSchemaLsp } from './SerializadorAssociacoesSchemaLsp';

const NOTIFICACAO_SCHEMAS = 'json/schemaAssociations';

/**
 * Implementação de `IClienteLspAtualizador` que envia notificações via `LanguageClient` do VS Code.
 *
 * @remarks
 * Razão de mudança exclusiva: alteração no mecanismo de envio de schemas ao
 * servidor LSP — por exemplo, troca da notificação `json/schemaAssociations`
 * por outra ou mudança na API de `sendNotification`.
 */
export class ClienteLspAtualizadorVsCode implements IClienteLspAtualizador {
    private readonly _cliente: BaseLanguageClient;

    /**
     * @param cliente - Cliente LSP já inicializado pelo bootstrap do entry point.
     */
    constructor(cliente: BaseLanguageClient) {
        this._cliente = cliente;
    }

    /**
     * Envia ao servidor LSP as associações schema ↔ arquivo vigentes.
     *
     * @remarks
     * O `CancellationToken` não é propagado — `sendNotification` não o suporta.
     *
     * @param associacoes - Lista de associações a enviar.
     * @param _ct - Token de cancelamento (não propagado).
     */
    async AtualizarSchemasAsync(
        associacoes: readonly AssociacaoSchema[],
        _ct: CancellationToken,
    ): Promise<void> {
        await this._cliente.sendNotification(
            NOTIFICACAO_SCHEMAS,
            SerializadorAssociacoesSchemaLsp.Serializar(associacoes),
        );
    }
}
