import type { CancellationToken } from 'vscode';
import type { DocumentoYaml } from '../../Entidades/DocumentoYaml';
import type { AssociacaoSchema } from '../../Entidades/AssociacaoSchema';

/**
 * Contrato para consulta de associações schema ↔ arquivo por documento.
 *
 * @remarks
 * Abstrai a origem das associações — podem vir das configurações `yaml.schemas`
 * do VS Code ou de uma seleção explícita do usuário. Separado de
 * `IRepositorioRegistroSchema` pois leitura e escrita são contextos distintos:
 * consulta ocorre no pipeline LSP, registro ocorre no comando de seleção manual.
 */
export interface IRepositorioConsultaSchema {
    /**
     * Obtém a associação de schema para o documento informado.
     *
     * @param documento - Documento YAML aberto no editor.
     * @param ct - Token de cancelamento da operação.
     * @returns Associação encontrada, ou `undefined` se nenhum schema cobrir o documento.
     */
    ObterPorDocumentoAsync(
        documento: DocumentoYaml,
        ct: CancellationToken,
    ): Promise<AssociacaoSchema | undefined>;
}
