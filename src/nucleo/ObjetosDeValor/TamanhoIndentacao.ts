import { TamanhoIndentacaoValidador } from '../Validadores/TamanhoIndentacaoValidador';

export class TamanhoIndentacao {
    private readonly _valor: number;

    constructor(valor: number) {
        TamanhoIndentacaoValidador.Validar(valor);
        this._valor = valor;
    }

    get Valor(): number {
        return this._valor;
    }

    Iguala(outro: TamanhoIndentacao): boolean {
        return this._valor === outro._valor;
    }
}
