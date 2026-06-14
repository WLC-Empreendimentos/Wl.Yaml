/**
 * Requisição para obtenção da associação de schema de um documento YAML.
 */
export interface ObterSchemaRequisicao {
    /** URI do documento YAML aberto no editor. */
    readonly uriDocumento: string;
}
