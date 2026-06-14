import type { PadraoArquivo } from '../ObjetosDeValor/PadraoArquivo';
import type { TamanhoIndentacao } from '../ObjetosDeValor/TamanhoIndentacao';
import type { TipoAspas } from '../Enums/TipoAspas';
import type { ModoQuebra } from '../Enums/ModoQuebra';

/**
 * Entidade que representa as regras de formatação YAML para um padrão de arquivo.
 *
 * @remarks
 * Associa um glob de arquivo às opções de formatação aplicadas pelo
 * yaml-language-server. A precedência entre perfis é responsabilidade
 * do serviço de resolução — a entidade apenas armazena as regras.
 */
export class PerfilFormatacao {
    private readonly _padraoArquivo: PadraoArquivo;
    private readonly _tamanhoIndentacao: TamanhoIndentacao;
    private readonly _tipoAspas: TipoAspas;
    private readonly _modoQuebra: ModoQuebra;

    /**
     * @param padraoArquivo - Glob que determina quais arquivos recebem este perfil.
     * @param tamanhoIndentacao - Número de espaços por nível de indentação.
     * @param tipoAspas - Tipo de aspas a usar na formatação de strings.
     * @param modoQuebra - Modo de tratamento de quebras de linha em blocos de texto.
     */
    constructor(
        padraoArquivo: PadraoArquivo,
        tamanhoIndentacao: TamanhoIndentacao,
        tipoAspas: TipoAspas,
        modoQuebra: ModoQuebra,
    ) {
        this._padraoArquivo = padraoArquivo;
        this._tamanhoIndentacao = tamanhoIndentacao;
        this._tipoAspas = tipoAspas;
        this._modoQuebra = modoQuebra;
    }

    /** Glob que determina quais arquivos recebem este perfil. */
    get PadraoArquivo(): PadraoArquivo {
        return this._padraoArquivo;
    }

    /** Número de espaços por nível de indentação. */
    get TamanhoIndentacao(): TamanhoIndentacao {
        return this._tamanhoIndentacao;
    }

    /** Tipo de aspas a usar na formatação de strings. */
    get TipoAspas(): TipoAspas {
        return this._tipoAspas;
    }

    /** Modo de tratamento de quebras de linha em blocos de texto. */
    get ModoQuebra(): ModoQuebra {
        return this._modoQuebra;
    }

    /**
     * Compara dois perfis de formatação por valor.
     *
     * @param outro - Perfil a comparar.
     * @returns `true` se todos os atributos forem iguais.
     */
    Iguala(outro: PerfilFormatacao): boolean {
        return (
            this._padraoArquivo.Iguala(outro._padraoArquivo) &&
            this._tamanhoIndentacao.Iguala(outro._tamanhoIndentacao) &&
            this._tipoAspas === outro._tipoAspas &&
            this._modoQuebra === outro._modoQuebra
        );
    }
}
