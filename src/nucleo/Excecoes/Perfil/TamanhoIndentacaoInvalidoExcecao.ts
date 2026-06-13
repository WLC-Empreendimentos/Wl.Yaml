import { ConfiguracaoInvalidaExcecao } from '../Base/ConfiguracaoInvalidaExcecao';

export class TamanhoIndentacaoInvalidoExcecao extends ConfiguracaoInvalidaExcecao {
    constructor() {
        super('Tamanho de indentação deve ser um inteiro entre 1 e 8.');
    }
}
