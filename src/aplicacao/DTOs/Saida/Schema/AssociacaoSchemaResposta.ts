/**
 * Resposta com a associação schema ↔ padrão de arquivo para um documento YAML.
 */
export interface AssociacaoSchemaResposta {
    /** URI do schema JSON associado. */
    readonly uriSchema: string;
    /** Padrão glob que cobre os arquivos desta associação. */
    readonly padraoArquivo: string;
}
