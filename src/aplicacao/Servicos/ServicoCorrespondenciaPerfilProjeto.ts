import type { CancellationToken } from 'vscode';
import type { IRepositorioPerfilProjeto } from '../../nucleo/Interfaces/Repositorios/IRepositorioPerfilProjeto';
import type { ICorrespondenciaGlob } from '../../nucleo/Interfaces/Servicos/ICorrespondenciaGlob';
import type { PerfilFormatacao } from '../../nucleo/Entidades/PerfilFormatacao';

/**
 * Encontra o perfil de formatação do projeto que corresponde a um documento YAML.
 *
 * @remarks
 * Lê o `.yaml-profile.json` do workspace via `IRepositorioPerfilProjeto` e
 * percorre os perfis até encontrar o primeiro cujo padrão glob cubra o documento.
 * Retorna `undefined` tanto quando o arquivo de perfis não existe quanto quando
 * nenhum padrão corresponde ao documento.
 */
export class ServicoCorrespondenciaPerfilProjeto {
    private readonly _repositorioPerfil: IRepositorioPerfilProjeto;
    private readonly _glob: ICorrespondenciaGlob;

    constructor(repositorioPerfil: IRepositorioPerfilProjeto, glob: ICorrespondenciaGlob) {
        this._repositorioPerfil = repositorioPerfil;
        this._glob = glob;
    }

    /**
     * Retorna o perfil cujo padrão glob corresponde ao documento informado.
     *
     * @param uriWorkspace - URI da raiz do workspace.
     * @param uriDocumento - URI do documento YAML aberto no editor.
     * @param ct - Token de cancelamento da operação.
     * @returns Primeiro perfil correspondente, ou `undefined` se o arquivo de
     *          perfis não existir ou nenhum padrão cobrir o documento.
     */
    async ObterPerfilCorrespondenteAsync(
        uriWorkspace: string,
        uriDocumento: string,
        ct: CancellationToken,
    ): Promise<PerfilFormatacao | undefined> {
        const perfilProjeto = await this._repositorioPerfil.ObterAsync(uriWorkspace, ct);
        return perfilProjeto?.Perfis.find(
            p => this._glob.Corresponde(uriDocumento, p.PadraoArquivo.Valor),
        );
    }
}
