import { YamlExtensaoExcecao } from './YamlExtensaoExcecao';

/**
 * Exceção base abstrata lançada quando um recurso esperado não é encontrado.
 *
 * @remarks
 * Subclasses devem especializar a mensagem com o identificador do recurso
 * ausente para facilitar diagnóstico — ex.: nome do perfil, URI do schema.
 */
export abstract class NaoEncontradoExcecao extends YamlExtensaoExcecao {}
