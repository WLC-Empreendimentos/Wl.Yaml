import { workspace } from 'vscode';
import type { CancellationToken } from 'vscode';
import type { IRepositorioPerfilPadrao } from '../../nucleo/Interfaces/Repositorios/IRepositorioPerfilPadrao';
import { PerfilFormatacao } from '../../nucleo/Entidades/PerfilFormatacao';
import { PadraoArquivo } from '../../nucleo/ObjetosDeValor/PadraoArquivo';
import { TamanhoIndentacao } from '../../nucleo/ObjetosDeValor/TamanhoIndentacao';
import { TipoAspas } from '../../nucleo/Enums/TipoAspas';
import { ModoQuebra } from '../../nucleo/Enums/ModoQuebra';

const MAPA_PROSE_WRAP: Readonly<Record<string, ModoQuebra>> = {
    preserve: ModoQuebra.Preservar,
    never: ModoQuebra.Nunca,
    always: ModoQuebra.Sempre,
};

/**
 * Constrói o perfil de formatação padrão a partir das configurações `yaml.format.*` do VS Code.
 *
 * @remarks
 * Serve como fonte de fallback em `ServicoResolucaoFormatacao` quando nenhum
 * `.yaml-profile.json` cobre o documento. O padrão glob resultante é sempre
 * `**\/*.yaml` pois estas configurações se aplicam globalmente a todos os
 * arquivos YAML. A indentação é lida de `editor.tabSize`.
 */
export class RepositorioPerfilPadraoVsCode implements IRepositorioPerfilPadrao {
    /**
     * Constrói o perfil de formatação a partir das configurações `yaml.format.*`.
     *
     * @param _ct - Token de cancelamento (não utilizado — leitura síncrona).
     * @returns Perfil com padrão `**\/*.yaml` montado a partir das configurações.
     */
    ObterAsync(_ct: CancellationToken): Promise<PerfilFormatacao> {
        const yaml = workspace.getConfiguration('yaml');
        const editor = workspace.getConfiguration('editor');

        const singleQuote = yaml.get<boolean>('format.singleQuote', false);
        const proseWrap = yaml.get<string>('format.proseWrap', 'preserve');
        const tabSize = editor.get<number>('tabSize', 2);

        return Promise.resolve(new PerfilFormatacao(
            new PadraoArquivo('**/*.yaml'),
            new TamanhoIndentacao(tabSize),
            singleQuote ? TipoAspas.Simples : TipoAspas.Duplas,
            MAPA_PROSE_WRAP[proseWrap] ?? ModoQuebra.Preservar,
        ));
    }
}
