/**
 * Tipo de aspas a utilizar na formatação de strings YAML.
 *
 * @remarks
 * Controla o caractere de aspas aplicado pelo yaml-language-server ao formatar
 * documentos. O valor string corresponde ao parâmetro aceito pelo servidor de
 * linguagem e é repassado diretamente na configuração de formatação.
 */
export enum TipoAspas {
    /** Aspas simples: `'valor'` */
    Simples = 'single',
    /** Aspas duplas: `"valor"` */
    Duplas = 'double',
}
