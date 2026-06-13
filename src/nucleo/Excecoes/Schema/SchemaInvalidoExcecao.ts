import { ConfiguracaoInvalidaExcecao } from '../Base/ConfiguracaoInvalidaExcecao';

/**
 * Exceção lançada quando um schema recuperado não é um JSON válido ou
 * não satisfaz a estrutura esperada pelo servidor de linguagem.
 *
 * @remarks
 * Lançada pelo adaptador de cache ao tentar desserializar um schema corrompido
 * ou pelo adaptador HTTP ao receber resposta malformada do SchemaStore.
 */
export class SchemaInvalidoExcecao extends ConfiguracaoInvalidaExcecao {
    /**
     * @param detalhe - Descrição do problema encontrado no schema.
     */
    constructor(detalhe: string) {
        super(`Schema inválido: ${detalhe}`);
    }
}
