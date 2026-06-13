import { ConfiguracaoInvalidaExcecao } from '../Base/ConfiguracaoInvalidaExcecao';

export class PadraoArquivoInvalidoExcecao extends ConfiguracaoInvalidaExcecao {
    constructor() {
        super('Padrão de arquivo não pode ser vazio.');
    }
}
