import { YamlExtensaoExcecao } from './YamlExtensaoExcecao';

/**
 * Exceção base abstrata lançada quando dados de configuração violam invariantes de domínio.
 *
 * @remarks
 * Cobre tanto configurações lidas do `.yaml-profile.json` quanto value objects
 * construídos com valores fora do intervalo permitido. Subclasses devem
 * incluir na mensagem o campo ou valor específico que causou a violação.
 */
export abstract class ConfiguracaoInvalidaExcecao extends YamlExtensaoExcecao {}
