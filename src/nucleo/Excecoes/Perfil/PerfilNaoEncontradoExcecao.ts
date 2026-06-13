import { NaoEncontradoExcecao } from '../Base/NaoEncontradoExcecao';

/**
 * Exceção lançada quando um perfil nomeado não existe no `.yaml-profile.json`.
 *
 * @remarks
 * Indica que o arquivo de perfil existe e é válido, mas o nome de perfil
 * solicitado não está definido nele. Lançada pelo repositório de perfil
 * ao tentar localizar um perfil específico por nome.
 */
export class PerfilNaoEncontradoExcecao extends NaoEncontradoExcecao {
    /**
     * @param nomePerfil - Nome do perfil que não foi encontrado.
     */
    constructor(nomePerfil: string) {
        super(`Perfil '${nomePerfil}' não encontrado no arquivo .yaml-profile.json.`);
    }
}
