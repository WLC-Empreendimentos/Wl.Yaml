import type { PerfilFormatacao } from './PerfilFormatacao';

/**
 * Entidade agregada que representa o conjunto de perfis de formatação de um workspace.
 *
 * @remarks
 * Corresponde ao conteúdo deserializado do `.yaml-profile.json` do projeto.
 * Cada perfil define regras de formatação para um padrão de arquivo distinto.
 * A precedência entre perfis sobrepostos é resolvida pelo serviço de formatação.
 */
export class PerfilProjeto {
    private readonly _perfis: readonly PerfilFormatacao[];

    /**
     * @param perfis - Lista de perfis de formatação do workspace.
     */
    constructor(perfis: readonly PerfilFormatacao[]) {
        this._perfis = perfis;
    }

    /** Lista de perfis de formatação do workspace. */
    get Perfis(): readonly PerfilFormatacao[] {
        return this._perfis;
    }

}
