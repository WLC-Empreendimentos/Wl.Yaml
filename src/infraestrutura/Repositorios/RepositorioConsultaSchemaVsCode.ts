import { workspace } from 'vscode';
import type { CancellationToken } from 'vscode';
import type { IRepositorioConsultaSchema } from '../../nucleo/Interfaces/Repositorios/IRepositorioConsultaSchema';
import type { ICorrespondenciaGlob } from '../../nucleo/Interfaces/Servicos/ICorrespondenciaGlob';
import type { DocumentoYaml } from '../../nucleo/Entidades/DocumentoYaml';
import { AssociacaoSchema } from '../../nucleo/Entidades/AssociacaoSchema';
import { UriSchema } from '../../nucleo/ObjetosDeValor/UriSchema';
import { PadraoArquivo } from '../../nucleo/ObjetosDeValor/PadraoArquivo';

/**
 * Consulta associações schema ↔ arquivo a partir da configuração `yaml.schemas` do VS Code.
 *
 * @remarks
 * O formato da configuração é `{ [uriSchema]: string | string[] }`, onde cada
 * chave é a URI do schema e o valor é um ou mais globs que determinam quais
 * arquivos recebem aquele schema. Retorna a primeira associação cujo glob
 * corresponda ao documento informado.
 */
export class RepositorioConsultaSchemaVsCode implements IRepositorioConsultaSchema {
    private readonly _correspondencia: ICorrespondenciaGlob;

    /**
     * @param correspondencia - Implementação de correspondência glob.
     */
    constructor(correspondencia: ICorrespondenciaGlob) {
        this._correspondencia = correspondencia;
    }

    /**
     * Obtém a associação de schema para o documento informado.
     *
     * @param documento - Documento YAML aberto no editor.
     * @param _ct - Token de cancelamento (não utilizado — leitura síncrona das configurações).
     * @returns Primeira associação cujo glob cubra o documento, ou `undefined` se nenhuma cobrir.
     */
    ObterPorDocumentoAsync(
        documento: DocumentoYaml,
        _ct: CancellationToken,
    ): Promise<AssociacaoSchema | undefined> {
        const schemas = workspace
            .getConfiguration('yaml')
            .get<Record<string, string | string[]>>('schemas', {});

        for (const [uri, padroes] of Object.entries(schemas)) {
            const listaPadroes = Array.isArray(padroes) ? padroes : [padroes];
            for (const padrao of listaPadroes) {
                if (this._correspondencia.Corresponde(documento.Uri, padrao)) {
                    return Promise.resolve(
                        new AssociacaoSchema(new UriSchema(uri), new PadraoArquivo(padrao)),
                    );
                }
            }
        }

        return Promise.resolve(undefined);
    }
}
