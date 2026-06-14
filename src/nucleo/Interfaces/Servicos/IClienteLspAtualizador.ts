import type { CancellationToken } from 'vscode';
import type { AssociacaoSchema } from '../../Entidades/AssociacaoSchema';

/**
 * Contrato para enviar associações schema ↔ arquivo ao yaml-language-server.
 *
 * @remarks
 * Isola o protocolo concreto de transporte (IPC no desktop, Web Worker no
 * browser). Serviços que apenas enviam atualizações não precisam conhecer
 * o estado de prontidão do cliente.
 */
export interface IClienteLspAtualizador {
    /**
     * Envia ao servidor LSP as associações schema ↔ arquivo vigentes.
     *
     * @remarks
     * Chamado sempre que as associações mudam — por alteração de settings,
     * seleção manual pelo usuário ou recarregamento do workspace.
     *
     * @param associacoes - Lista de associações a enviar.
     * @param ct - Token de cancelamento da operação.
     */
    AtualizarSchemasAsync(
        associacoes: readonly AssociacaoSchema[],
        ct: CancellationToken,
    ): Promise<void>;
}
