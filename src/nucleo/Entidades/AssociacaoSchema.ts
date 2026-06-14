import type { UriSchema } from '../ObjetosDeValor/UriSchema';
import type { PadraoArquivo } from '../ObjetosDeValor/PadraoArquivo';

/**
 * Entidade que associa um schema JSON a um padrão de arquivo.
 *
 * @remarks
 * Usada para vincular um schema (URI) a arquivos que correspondem a um
 * glob, permitindo validação e autocompleção específicas por tipo de
 * arquivo YAML. Corresponde a uma entrada de `yaml.schemas` do servidor.
 */
export class AssociacaoSchema {
    private readonly _uriSchema: UriSchema;
    private readonly _padraoArquivo: PadraoArquivo;

    /**
     * @param uriSchema - URI do schema JSON a associar.
     * @param padraoArquivo - Glob que determina quais arquivos recebem o schema.
     */
    constructor(uriSchema: UriSchema, padraoArquivo: PadraoArquivo) {
        this._uriSchema = uriSchema;
        this._padraoArquivo = padraoArquivo;
    }

    /** URI do schema JSON associado. */
    get UriSchema(): UriSchema {
        return this._uriSchema;
    }

    /** Glob que determina quais arquivos recebem o schema. */
    get PadraoArquivo(): PadraoArquivo {
        return this._padraoArquivo;
    }

    /**
     * Compara duas associações por valor.
     *
     * @param outro - Associação a comparar.
     * @returns `true` se URI e padrão forem iguais.
     */
    Iguala(outro: AssociacaoSchema): boolean {
        return (
            this._uriSchema.Iguala(outro._uriSchema) &&
            this._padraoArquivo.Iguala(outro._padraoArquivo)
        );
    }
}
