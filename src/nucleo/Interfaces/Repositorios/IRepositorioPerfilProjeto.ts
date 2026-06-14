import type { CancellationToken } from 'vscode';
import type { PerfilProjeto } from '../../Entidades/PerfilProjeto';

/**
 * Contrato para leitura do arquivo `.yaml-profile.json` do workspace.
 *
 * @remarks
 * Responsável exclusivamente por ler e deserializar o arquivo de perfis.
 * Retorna `undefined` quando o arquivo não existe — ausência de perfil
 * não é erro. Lança `PerfilInvalidoExcecao` apenas quando o arquivo
 * existe mas não passa na verificação estrutural.
 */
export interface IRepositorioPerfilProjeto {
    /**
     * Obtém os perfis de formatação do workspace informado.
     *
     * @param uriWorkspace - URI da raiz do workspace.
     * @param ct - Token de cancelamento da operação.
     * @returns Perfis configurados, ou `undefined` se o arquivo não existe.
     * @throws {PerfilInvalidoExcecao} Quando o arquivo existe mas sua estrutura é inválida.
     */
    ObterAsync(uriWorkspace: string, ct: CancellationToken): Promise<PerfilProjeto | undefined>;
}
