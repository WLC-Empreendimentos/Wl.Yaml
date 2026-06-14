import { PerfilInvalidoExcecao } from './PerfilInvalidoExcecao';

/**
 * Exceção lançada quando o conteúdo do `.yaml-profile.json` não é um JSON válido.
 *
 * @remarks
 * Lançada pelo `RepositorioPerfilProjetoJson` quando `JSON.parse` falha ao
 * processar os bytes lidos do arquivo. Indica corrupção ou sintaxe inválida
 * no arquivo de perfil, não ausência do mesmo.
 */
export class PerfilJsonInvalidoExcecao extends PerfilInvalidoExcecao {
    constructor() {
        super('JSON inválido');
    }
}
