import { minimatch } from 'minimatch';
import type { ICorrespondenciaGlob } from '../../nucleo/Interfaces/Servicos/ICorrespondenciaGlob';

// Provisório: minimatch será substituído por biblioteca própria em português.
// A troca será cirúrgica — ICorrespondenciaGlob isola o restante do código.
export class CorrespondenciaGlobMinimatch implements ICorrespondenciaGlob {
    /**
     * Verifica se o caminho informado corresponde ao padrão glob.
     *
     * @param caminho - Caminho do arquivo a testar.
     * @param padrao - Padrão glob (ex: `**\/*.yaml`).
     * @returns `true` se o caminho corresponde ao padrão.
     */
    Corresponde(caminho: string, padrao: string): boolean {
        return minimatch(caminho, padrao, { dot: true });
    }
}
