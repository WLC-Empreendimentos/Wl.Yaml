import type { BaseLanguageClient } from 'vscode-languageclient';
import { State } from 'vscode-languageclient';
import type { IClienteLspAtivo } from '../../nucleo/Interfaces/Servicos/IClienteLspAtivo';

/**
 * Implementação de `IClienteLspAtivo` que consulta o estado do `LanguageClient` do VS Code.
 *
 * @remarks
 * Razão de mudança exclusiva: alteração na forma de determinar se o servidor
 * LSP está pronto — por exemplo, inclusão do estado `Starting` como ativo.
 */
export class ClienteLspAtivoVsCode implements IClienteLspAtivo {
    private readonly _cliente: BaseLanguageClient;

    /**
     * @param cliente - Cliente LSP já inicializado pelo bootstrap do entry point.
     */
    constructor(cliente: BaseLanguageClient) {
        this._cliente = cliente;
    }

    /**
     * Indica se o servidor LSP está ativo e pronto para receber mensagens.
     *
     * @returns `true` quando o cliente está no estado `Running`.
     */
    EstaAtivo(): boolean {
        return this._cliente.state === State.Running;
    }
}
