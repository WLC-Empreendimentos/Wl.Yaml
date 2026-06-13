import { PadraoArquivoValidador } from '../Validadores/PadraoArquivoValidador';

export class PadraoArquivo {
    private readonly _valor: string;

    constructor(valor: string) {
        PadraoArquivoValidador.Validar(valor);
        this._valor = valor.trim();
    }

    get Valor(): string {
        return this._valor;
    }

    Iguala(outro: PadraoArquivo): boolean {
        return this._valor === outro._valor;
    }
}
