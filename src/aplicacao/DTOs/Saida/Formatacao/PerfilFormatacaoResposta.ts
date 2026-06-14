import type { TipoAspas } from '../../../../nucleo/Enums/TipoAspas';
import type { ModoQuebra } from '../../../../nucleo/Enums/ModoQuebra';

/**
 * Resposta com as regras de formatação efetivas para um documento YAML.
 *
 * @remarks
 * Representa o perfil resolvido após aplicação de precedência
 * (`.yaml-profile.json` sobre `yaml.format.*`). O campo `padraoArquivo`
 * é omitido intencionalmente: o chamador já conhece o documento e
 * não precisa saber qual glob correspondeu.
 */
export interface PerfilFormatacaoResposta {
    /** Número de espaços por nível de indentação. */
    readonly tamanhoIndentacao: number;
    /** Estilo de aspas preferido para strings YAML. */
    readonly tipoAspas: TipoAspas;
    /** Comportamento de quebra de linhas longas. */
    readonly modoQuebra: ModoQuebra;
}
