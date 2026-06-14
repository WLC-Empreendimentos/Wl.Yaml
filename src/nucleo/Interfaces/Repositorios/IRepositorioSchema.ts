import type { CancellationToken } from 'vscode';
import type { DocumentoYaml } from '../../Entidades/DocumentoYaml';
import type { AssociacaoSchema } from '../../Entidades/AssociacaoSchema';

/**
 * Contrato para leitura e persistência de associações schema ↔ arquivo.
 *
 * @remarks
 * Abstrai a origem das associações — podem vir das configurações
 * `yaml.schemas` do VS Code ou de uma seleção explícita do usuário
 * via `ComandoSelecionarSchema`. A resolução por glob (qual schema
 * se aplica a qual documento) é responsabilidade do serviço.
 */
export interface IRepositorioSchema {
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

    /**
     * Persiste uma associação schema ↔ arquivo.
     *
     * @param associacao - Associação a salvar.
     * @param ct - Token de cancelamento da operação.
     */
    SalvarAsync(associacao: AssociacaoSchema, ct: CancellationToken): Promise<void>;
}
