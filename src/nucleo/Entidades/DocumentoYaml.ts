import { UriDocumentoValidador } from '../Validadores/UriDocumentoValidador';

/**
 * Entidade que representa um documento YAML aberto no editor.
 *
 * @remarks
 * Encapsula a URI do documento ativo para uso nos serviços de resolução
 * de perfil e associação de schema. Criada pela camada de apresentação
 * a partir do `TextDocument` recebido pela API do VS Code.
 */
export class DocumentoYaml {
    private readonly _uri: string;

    /**
     * @param uri - URI do documento aberto no editor. Não pode ser vazia.
     * @throws {UriDocumentoInvalidaExcecao} Quando a URI for vazia ou conter apenas espaços.
     */
    constructor(uri: string) {
        UriDocumentoValidador.Validar(uri);
        this._uri = uri;
    }

    /** URI do documento no editor. */
    get Uri(): string {
        return this._uri;
    }

    /**
     * Compara dois documentos por URI.
     *
     * @param outro - Documento a comparar.
     * @returns `true` se os documentos têm a mesma URI.
     */
    Iguala(outro: DocumentoYaml): boolean {
        return this._uri === outro._uri;
    }
}
