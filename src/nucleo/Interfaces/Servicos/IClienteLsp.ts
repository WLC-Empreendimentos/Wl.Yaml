import type { CancellationToken } from 'vscode';
import type { AssociacaoSchema } from '../../Entidades/AssociacaoSchema';

/**
 * Contrato para comunicação com o servidor yaml-language-server via LSP.
 *
 * @remarks
 * Isola o código de aplicação do protocolo concreto de transporte (IPC no
 * desktop, Web Worker no browser). A camada de apresentação inicializa o
 * cliente; os serviços apenas enviam dados via este contrato.
 */
export interface IClienteLsp {
    /**
     * Indica se o servidor LSP está ativo e pronto para receber mensagens.
     *
     * @returns `true` quando o cliente está no estado `Running`.
     */
    EstaAtivo(): boolean;

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
