import { UriSchemaValidador } from '../Validadores/UriSchemaValidador';

export class UriSchema {
    private readonly _valor: string;

    constructor(valor: string) {
        UriSchemaValidador.Validar(valor);
        this._valor = valor;
    }

    get Valor(): string {
        return this._valor;
    }

    Iguala(outro: UriSchema): boolean {
        return this._valor === outro._valor;
    }
}
