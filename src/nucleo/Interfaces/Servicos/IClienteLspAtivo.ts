/**
 * Contrato para consultar o estado de prontidão do yaml-language-server.
 *
 * @remarks
 * Isola serviços que apenas precisam saber se o servidor está pronto para
 * receber mensagens, sem expor operações de envio.
 */
export interface IClienteLspAtivo {
    /**
     * Indica se o servidor LSP está ativo e pronto para receber mensagens.
     *
     * @returns `true` quando o cliente está no estado `Running`.
     */
    EstaAtivo(): boolean;
}
