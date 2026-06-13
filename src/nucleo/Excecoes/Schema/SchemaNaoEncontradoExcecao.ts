import { NaoEncontradoExcecao } from '../Base/NaoEncontradoExcecao';

/**
 * Exceção lançada quando um schema não é encontrado para a URI solicitada.
 *
 * @remarks
 * Lançada pelo adaptador de cache ou pelo adaptador HTTP ao não localizar
 * o schema nem localmente nem no SchemaStore remoto.
 */
export class SchemaNaoEncontradoExcecao extends NaoEncontradoExcecao {
    /**
     * @param uri - URI do schema que não foi encontrado.
     */
    constructor(uri: string) {
        super(`Schema não encontrado para a URI '${uri}'.`);
    }
}
