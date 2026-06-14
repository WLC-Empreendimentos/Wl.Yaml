import { PerfilInvalidoExcecao } from './PerfilInvalidoExcecao';

/**
 * Exceção lançada quando a construção de um `PerfilFormatacao` falha por valores inválidos.
 *
 * @remarks
 * Lançada pelo `PerfilFormatacaoDesserializador` ao capturar erros originados
 * nas validações internas dos Objetos de Valor (ex: `PadraoArquivo`, `TamanhoIndentacao`).
 */
export class PerfilMalFormadoExcecao extends PerfilInvalidoExcecao {
    /**
     * @param contexto - Descrição do local no documento (ex: `"perfis[0]"`).
     * @param causa - Erro original capturado no construtor do Objeto de Valor.
     */
    constructor(contexto: string, causa: unknown) {
        super(`${contexto}: ${String(causa)}`);
    }
}
