import { YamlExtensaoExcecao } from './YamlExtensaoExcecao';

/**
 * Exceção lançada quando uma pré-condição de entrada de serviço é violada.
 *
 * @remarks
 * Diferente de `ConfiguracaoInvalidaExcecao`, representa chamadas mal-formadas
 * do consumidor — parâmetro ausente, string vazia, URI inválida — e não dados
 * de configuração do projeto. É concreta porque qualquer serviço pode lançá-la
 * diretamente sem precisar de especialização.
 */
export class EntradaInvalidaExcecao extends YamlExtensaoExcecao {

}
