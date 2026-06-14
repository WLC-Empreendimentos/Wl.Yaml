import type { CancellationToken, Memento } from 'vscode';
import type { IRepositorioRegistroSchema } from '../../nucleo/Interfaces/Repositorios/IRepositorioRegistroSchema';
import type { AssociacaoSchema } from '../../nucleo/Entidades/AssociacaoSchema';

const CHAVE_ASSOCIACOES = 'wl-yaml.associacoes-schema';

interface AssociacaoJson {
    uriSchema: string;
    padraoArquivo: string;
}

/**
 * Persiste associações schema ↔ padrão de arquivo no VS Code Memento (estado global).
 *
 * @remarks
 * Cada chamada a `SalvarAsync` substitui qualquer associação anterior com o
 * mesmo padrão de arquivo, garantindo que um padrão seja sempre coberto por
 * exatamente um schema.  O Memento é o armazenamento de seleções manuais do
 * usuário — separado das configurações `yaml.schemas` do workspace.
 */
export class RepositorioRegistroSchemaMementoVsCode implements IRepositorioRegistroSchema {
    private readonly _memento: Memento;

    /**
     * @param memento - Memento global da extensão (`context.globalState`).
     */
    constructor(memento: Memento) {
        this._memento = memento;
    }

    /**
     * Persiste uma associação schema ↔ padrão de arquivo, substituindo entrada anterior com o mesmo padrão.
     *
     * @param associacao - Associação a salvar.
     * @param _ct - Token de cancelamento (não utilizado — a API de Memento não o suporta).
     */
    async SalvarAsync(associacao: AssociacaoSchema, _ct: CancellationToken): Promise<void> {
        const existentes = this._memento.get<AssociacaoJson[]>(CHAVE_ASSOCIACOES, []);
        const novaEntrada: AssociacaoJson = {
            uriSchema: associacao.UriSchema.Valor,
            padraoArquivo: associacao.PadraoArquivo.Valor,
        };
        const atualizado = [
            ...existentes.filter(a => a.padraoArquivo !== novaEntrada.padraoArquivo),
            novaEntrada,
        ];
        await this._memento.update(CHAVE_ASSOCIACOES, atualizado);
    }
}
