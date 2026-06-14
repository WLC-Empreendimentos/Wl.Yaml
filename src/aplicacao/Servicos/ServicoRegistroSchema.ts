import type { CancellationToken } from 'vscode';
import type { IRepositorioRegistroSchema } from '../../nucleo/Interfaces/Repositorios/IRepositorioRegistroSchema';
import type { SalvarSchemaRequisicao } from '../DTOs/Entrada/Schema/SalvarSchemaRequisicao';
import { UriSchema } from '../../nucleo/ObjetosDeValor/UriSchema';
import { PadraoArquivo } from '../../nucleo/ObjetosDeValor/PadraoArquivo';
import { AssociacaoSchema } from '../../nucleo/Entidades/AssociacaoSchema';

/**
 * Registra a associação entre um schema JSON e um padrão de arquivo YAML.
 *
 * @remarks
 * Acionado pelo `ComandoSelecionarSchema` quando o usuário escolhe manualmente
 * um schema para um conjunto de arquivos. A construção das entidades de domínio
 * a partir do DTO garante que as invariantes sejam verificadas antes de qualquer I/O.
 */
export class ServicoRegistroSchema {
    private readonly _repositorioSchema: IRepositorioRegistroSchema;

    constructor(repositorioSchema: IRepositorioRegistroSchema) {
        this._repositorioSchema = repositorioSchema;
    }

    /**
     * Persiste a associação entre um schema JSON e um padrão de arquivo.
     *
     * @param req - Requisição com URI do schema e padrão glob de arquivo.
     * @param ct - Token de cancelamento da operação.
     * @throws {UriSchemaInvalidaExcecao} Quando a URI do schema for vazia.
     * @throws {PadraoArquivoInvalidoExcecao} Quando o padrão de arquivo for vazio.
     */
    async SalvarAsync(req: SalvarSchemaRequisicao, ct: CancellationToken): Promise<void> {
        const uriSchema = new UriSchema(req.uriSchema);
        const padraoArquivo = new PadraoArquivo(req.padraoArquivo);
        const associacao = new AssociacaoSchema(uriSchema, padraoArquivo);
        await this._repositorioSchema.SalvarAsync(associacao, ct);
    }
}
