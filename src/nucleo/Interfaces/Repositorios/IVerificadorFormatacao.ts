/**
 * Contrato para verificação do estado de habilitação da formatação YAML.
 *
 * @remarks
 * Abstrai a leitura de `yaml.format.enable` do VS Code, permitindo que a
 * camada de apresentação consulte o estado da feature sem depender da API
 * do editor diretamente. Separado de `IRepositorioPerfilPadrao` pois este
 * check é síncrono e usado em contextos distintos (ex: status bar, comandos).
 */
export interface IVerificadorFormatacao {
    /**
     * Indica se a formatação YAML está habilitada nas configurações do editor.
     *
     * @returns `true` quando `yaml.format.enable` está ativo.
     */
    FormatacaoHabilitada(): boolean;
}
