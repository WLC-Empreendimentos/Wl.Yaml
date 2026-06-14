/**
 * Requisição para persistência de uma associação schema ↔ padrão de arquivo.
 *
 * @remarks
 * Originada pelo `ComandoSelecionarSchema` quando o usuário escolhe manualmente
 * um schema para um conjunto de arquivos.
 */
export interface SalvarSchemaRequisicao {
    /** Padrão glob que identifica os arquivos cobertos pelo schema (ex: `**\/*.yaml`). */
    readonly padraoArquivo: string;
    /** URI do schema JSON a associar ao padrão. */
    readonly uriSchema: string;
}
