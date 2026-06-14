import { EntradaInvalidaExcecao } from '../Base/EntradaInvalidaExcecao';

/**
 * Exceção lançada quando a URI de um documento YAML está vazia.
 */
export class UriDocumentoInvalidaExcecao extends EntradaInvalidaExcecao {
    constructor() {
        super('URI do documento não pode ser vazia.');
    }
}
