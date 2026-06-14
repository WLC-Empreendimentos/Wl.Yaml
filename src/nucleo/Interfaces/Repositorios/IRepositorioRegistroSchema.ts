import type { CancellationToken } from 'vscode';
import type { AssociacaoSchema } from '../../Entidades/AssociacaoSchema';

/**
 * Contrato para persistência de associações schema ↔ arquivo.
 *
 * @remarks
 * Acionado exclusivamente pelo `ComandoSelecionarSchema` quando o usuário
 * escolhe manualmente um schema para um conjunto de arquivos. Separado de
 * `IRepositorioConsultaSchema` pois escrita e leitura têm ciclos de vida
 * e implementações potencialmente distintos.
 */
export interface IRepositorioRegistroSchema {
    /**
     * Persiste uma associação schema ↔ padrão de arquivo.
     *
     * @param associacao - Associação a salvar.
     * @param ct - Token de cancelamento da operação.
     */
    SalvarAsync(associacao: AssociacaoSchema, ct: CancellationToken): Promise<void>;
}
