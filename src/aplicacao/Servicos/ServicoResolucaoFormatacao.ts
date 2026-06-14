import type { CancellationToken } from 'vscode';
import type { IRepositorioConfiguracoes } from '../../nucleo/Interfaces/Repositorios/IRepositorioConfiguracoes';
import type { ResolverPerfilRequisicao } from '../DTOs/Entrada/Formatacao/ResolverPerfilRequisicao';
import type { PerfilFormatacaoResposta } from '../DTOs/Saida/Formatacao/PerfilFormatacaoResposta';
import type { ServicoCorrespondenciaPerfilProjeto } from './ServicoCorrespondenciaPerfilProjeto';
import { PerfilFormatacaoMapeador } from '../Mapeadores/PerfilFormatacaoMapeador';

/**
 * Orquestra a resolução do perfil de formatação efetivo para um documento YAML.
 *
 * @remarks
 * Aplica a seguinte ordem de precedência:
 * 1. Perfil do projeto: primeiro padrão em `.yaml-profile.json` que cubra o documento.
 * 2. Perfil das configurações: derivado de `yaml.format.*` do VS Code.
 * 3. `undefined` quando nenhuma fonte define um perfil.
 */
export class ServicoResolucaoFormatacao {
    private readonly _correspondencia: ServicoCorrespondenciaPerfilProjeto;
    private readonly _repositorioConfiguracoes: IRepositorioConfiguracoes;

    constructor(
        correspondencia: ServicoCorrespondenciaPerfilProjeto,
        repositorioConfiguracoes: IRepositorioConfiguracoes,
    ) {
        this._correspondencia = correspondencia;
        this._repositorioConfiguracoes = repositorioConfiguracoes;
    }

    /**
     * Resolve o perfil de formatação efetivo para o documento informado.
     *
     * @param req - Requisição com URI do documento e do workspace.
     * @param ct - Token de cancelamento da operação.
     * @returns Perfil efetivo mapeado para DTO, ou `undefined` quando nenhuma
     *          fonte define regras de formatação para o documento.
     */
    async ResolverPerfilEfetivoAsync(
        req: ResolverPerfilRequisicao,
        ct: CancellationToken,
    ): Promise<PerfilFormatacaoResposta | undefined> {
        const perfilProjeto = await this._correspondencia.ObterPerfilCorrespondenteAsync(
            req.uriWorkspace, req.uriDocumento, ct,
        );
        const perfilEfetivo = perfilProjeto ?? await this._repositorioConfiguracoes.ObterPerfilAsync(ct);
        return perfilEfetivo ? PerfilFormatacaoMapeador.ParaResposta(perfilEfetivo) : undefined;
    }
}
