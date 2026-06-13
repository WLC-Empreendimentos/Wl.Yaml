import { ConfiguracaoInvalidaExcecao } from '../Base/ConfiguracaoInvalidaExcecao';

/**
 * Exceção lançada quando o `.yaml-profile.json` contém dados estruturalmente inválidos.
 *
 * @remarks
 * Lançada pelo repositório ao ler o arquivo de perfil ou pelo validador ao
 * verificar a estrutura do DTO de entrada. Nunca lançada por dados de
 * configuração do VS Code — para esses casos use `ConfiguracaoInvalidaExcecao`.
 */
export class PerfilInvalidoExcecao extends ConfiguracaoInvalidaExcecao {
    /**
     * @param detalhe - Campo ou estrutura específica que causou a invalidação.
     */
    constructor(detalhe: string) {
        super(`Perfil de formatação inválido: ${detalhe}`);
    }
}
