/**
 * Classe base abstrata de todas as exceções lançadas pela extensão Wl.Yaml.
 *
 * @remarks
 * Permite captura genérica no ponto de entrada da apresentação sem suprimir
 * erros de terceiros ou do runtime. `Object.setPrototypeOf` corrige a cadeia
 * de protótipos quebrada pelo transpilador TypeScript ao estender `Error`,
 * garantindo que `instanceof` funcione corretamente em toda a hierarquia.
 */
export abstract class YamlExtensaoExcecao extends Error {
    constructor(mensagem: string) {
        super(mensagem);
        this.name = this.constructor.name;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
