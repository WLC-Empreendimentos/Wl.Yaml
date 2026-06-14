import { Uri, workspace } from 'vscode';
import type { CancellationToken } from 'vscode';
import type { IRepositorioPerfilProjeto } from '../../nucleo/Interfaces/Repositorios/IRepositorioPerfilProjeto';
import type { PerfilProjeto } from '../../nucleo/Entidades/PerfilProjeto';
import { PerfilJsonInvalidoExcecao } from '../../nucleo/Excecoes/Perfil/PerfilJsonInvalidoExcecao';
import { PerfilProjetoDesserializador } from '../Desserializadores/Perfil/PerfilProjetoDesserializador';

const NOME_ARQUIVO = '.yaml-profile.json';

/**
 * Lê o `.yaml-profile.json` da raiz do workspace e delega a desserialização.
 *
 * @remarks
 * Responsável exclusivamente pelo I/O: localiza o arquivo, lida com ausência
 * e erros de acesso, e entrega os bytes decodificados ao desserializador.
 * Retorna `undefined` quando o arquivo não existe — ausência não é erro.
 */
export class RepositorioPerfilProjetoJson implements IRepositorioPerfilProjeto {
    /**
     * Obtém os perfis de formatação do workspace informado.
     *
     * @param uriWorkspace - URI da raiz do workspace.
     * @param _ct - Token de cancelamento (não propagado — a API de fs do VS Code não o suporta).
     * @returns Perfis configurados, ou `undefined` se o arquivo não existe.
     * @throws {PerfilJsonInvalidoExcecao} Quando o arquivo existe mas não contém JSON válido.
     * @throws {PerfilInvalidoExcecao} Quando o JSON existe mas sua estrutura é inválida.
     */
    async ObterAsync(uriWorkspace: string, _ct: CancellationToken): Promise<PerfilProjeto | undefined> {
        const uri = Uri.joinPath(Uri.parse(uriWorkspace), NOME_ARQUIVO);

        let bytes: Uint8Array;
        try {
            bytes = await workspace.fs.readFile(uri);
        } catch (erro: unknown) {
            if (isFileNotFound(erro)) return undefined;
            throw erro;
        }

        const texto = new TextDecoder().decode(bytes);
        let raw: unknown;
        try {
            raw = JSON.parse(texto) as unknown;
        } catch {
            throw new PerfilJsonInvalidoExcecao();
        }

        return PerfilProjetoDesserializador.Desserializar(raw);
    }
}

function isFileNotFound(erro: unknown): boolean {
    return (
        typeof erro === 'object' &&
        erro !== null &&
        'code' in erro &&
        (erro as Record<string, unknown>)['code'] === 'FileNotFound'
    );
}
