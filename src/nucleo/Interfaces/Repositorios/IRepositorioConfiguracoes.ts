import type { CancellationToken } from 'vscode';
import type { PerfilFormatacao } from '../../Entidades/PerfilFormatacao';

/**
 * Contrato para leitura das configurações `yaml.format.*` do VS Code.
 *
 * @remarks
 * Camada de abstração sobre `workspace.getConfiguration('yaml')`.
 * Permite que o serviço de formatação consuma configurações do editor
 * sem depender da API do VS Code diretamente. Serve como fallback
 * quando nenhum `.yaml-profile.json` é encontrado no workspace.
 */
export interface IRepositorioConfiguracoes {
    /**
     * Indica se a formatação YAML está habilitada nas configurações do editor.
     *
     * @returns `true` quando `yaml.format.enable` está ativo.
     */
    FormatacaoHabilitada(): boolean;

    /**
     * Obtém o perfil de formatação derivado das configurações do editor.
     *
     * @param ct - Token de cancelamento da operação.
     * @returns Perfil com padrão `**\/*.yaml` montado a partir de `yaml.format.*`,
     *          ou `undefined` se nenhuma configuração relevante estiver definida.
     */
    ObterPerfilAsync(ct: CancellationToken): Promise<PerfilFormatacao | undefined>;
}
