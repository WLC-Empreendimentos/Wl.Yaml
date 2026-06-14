import type { CancellationToken } from 'vscode';
import type { IRepositorioConsultaSchema } from '../../nucleo/Interfaces/Repositorios/IRepositorioConsultaSchema';
import type { ObterSchemaRequisicao } from '../DTOs/Entrada/Schema/ObterSchemaRequisicao';
import type { AssociacaoSchemaResposta } from '../DTOs/Saida/Schema/AssociacaoSchemaResposta';
import { DocumentoYaml } from '../../nucleo/Entidades/DocumentoYaml';
import { AssociacaoSchemaMapeador } from '../Mapeadores/AssociacaoSchemaMapeador';

/**
 * Consulta a associação de schema para um documento YAML aberto no editor.
 *
 * @remarks
 * Acionado pelo pipeline do LSP ao abrir ou salvar um documento, para
 * determinar qual schema JSON deve ser vinculado ao arquivo no servidor
 * de linguagem.
 */
export class ServicoConsultaSchema {
    private readonly _repositorioSchema: IRepositorioConsultaSchema;

    constructor(repositorioSchema: IRepositorioConsultaSchema) {
        this._repositorioSchema = repositorioSchema;
    }

    /**
     * Retorna a associação de schema para o documento informado.
     *
     * @param req - Requisição com a URI do documento YAML.
     * @param ct - Token de cancelamento da operação.
     * @returns Associação encontrada mapeada para DTO, ou `undefined` se nenhum
     *          schema estiver associado ao documento.
     * @throws {UriDocumentoInvalidaExcecao} Quando a URI do documento for vazia.
     */
    async ObterPorDocumentoAsync(
        req: ObterSchemaRequisicao,
        ct: CancellationToken,
    ): Promise<AssociacaoSchemaResposta | undefined> {
        const documento = new DocumentoYaml(req.uriDocumento);
        const associacao = await this._repositorioSchema.ObterPorDocumentoAsync(documento, ct);
        return associacao ? AssociacaoSchemaMapeador.ParaResposta(associacao) : undefined;
    }
}
