/**
 * Requisição para resolução do perfil de formatação efetivo de um documento.
 *
 * @remarks
 * O serviço busca primeiro em `.yaml-profile.json` do workspace; se nenhum
 * padrão cobrir o documento, recorre às configurações `yaml.format.*` do VS Code.
 */
export interface ResolverPerfilRequisicao {
    /** URI do documento YAML aberto no editor. */
    readonly uriDocumento: string;
    /** URI da raiz do workspace ao qual o documento pertence. */
    readonly uriWorkspace: string;
}
