/**
 * Contrato para correspondência de caminhos contra padrões glob.
 *
 * @remarks
 * Isola o serviço de formatação da biblioteca concreta de glob (minimatch,
 * micromatch, etc.). A implementação fica na camada de infraestrutura.
 */
export interface ICorrespondenciaGlob {
    /**
     * Verifica se o caminho informado corresponde ao padrão glob.
     *
     * @param caminho - Caminho do arquivo a testar.
     * @param padrao - Padrão glob (ex: `**\/*.yaml`).
     * @returns `true` se o caminho corresponde ao padrão.
     */
    Corresponde(caminho: string, padrao: string): boolean;
}
