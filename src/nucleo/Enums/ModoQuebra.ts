/**
 * Modo de tratamento de quebras de linha em blocos de texto YAML.
 *
 * @remarks
 * Controla como o yaml-language-server trata quebras de linha ao formatar
 * blocos de prosa. O valor string corresponde ao parâmetro `proseWrap` aceito
 * pelo servidor de linguagem e é repassado diretamente na configuração de
 * formatação.
 */
export enum ModoQuebra {
    /** Preserva as quebras de linha existentes sem alteração. */
    Preservar = 'preserve',
    /** Remove quebras de linha, mantendo o texto em linha única. */
    Nunca = 'never',
    /** Insere quebras de linha conforme a largura de linha configurada. */
    Sempre = 'always',
}
