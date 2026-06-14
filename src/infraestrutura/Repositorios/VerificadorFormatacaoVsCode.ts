import { workspace } from 'vscode';
import type { IVerificadorFormatacao } from '../../nucleo/Interfaces/Repositorios/IVerificadorFormatacao';

/**
 * Verifica o estado de habilitação da formatação YAML nas configurações do VS Code.
 *
 * @remarks
 * Abstrai a leitura de `yaml.format.enable`, permitindo que a camada de apresentação
 * e os comandos consultem o estado da feature sem depender da API do editor diretamente.
 */
export class VerificadorFormatacaoVsCode implements IVerificadorFormatacao {
    /**
     * Indica se a formatação YAML está habilitada nas configurações do VS Code.
     *
     * @returns Valor de `yaml.format.enable`; `true` quando não configurado.
     */
    FormatacaoHabilitada(): boolean {
        return workspace.getConfiguration('yaml').get<boolean>('format.enable', true);
    }
}
