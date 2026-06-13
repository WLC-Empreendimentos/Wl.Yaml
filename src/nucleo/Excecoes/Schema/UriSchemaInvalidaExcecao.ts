import { ConfiguracaoInvalidaExcecao } from '../Base/ConfiguracaoInvalidaExcecao';

export class UriSchemaInvalidaExcecao extends ConfiguracaoInvalidaExcecao {
    constructor() {
        super('URI do schema não pode ser vazia.');
    }
}
