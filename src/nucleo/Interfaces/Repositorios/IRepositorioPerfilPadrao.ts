import type { CancellationToken } from 'vscode';
import type { PerfilFormatacao } from '../../Entidades/PerfilFormatacao';

/**
 * Contrato para leitura do perfil de formatação padrão das configurações do editor.
 *
 * @remarks
 * Abstrai a leitura de `yaml.format.*` e `editor.tabSize` do VS Code.
 * Serve como fonte de fallback em `ServicoResolucaoFormatacao` quando nenhum
 * `.yaml-profile.json` cobre o documento. Separado de `IVerificadorFormatacao`
 * pois constrói uma entidade de domínio — razão de mudança distinta.
 */
export interface IRepositorioPerfilPadrao {
    /**
     * Obtém o perfil de formatação derivado das configurações do editor.
     *
     * @param ct - Token de cancelamento da operação.
     * @returns Perfil com padrão `**\/*.yaml` montado a partir das configurações,
     *          ou `undefined` se nenhuma configuração relevante estiver definida.
     */
    ObterAsync(ct: CancellationToken): Promise<PerfilFormatacao | undefined>;
}
