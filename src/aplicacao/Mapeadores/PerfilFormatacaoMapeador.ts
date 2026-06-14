import type { PerfilFormatacao } from '../../nucleo/Entidades/PerfilFormatacao';
import type { PerfilFormatacaoResposta } from '../DTOs/Saida/Formatacao/PerfilFormatacaoResposta';

/**
 * Converte a entidade `PerfilFormatacao` para o DTO de saída.
 *
 * @remarks
 * Extrai os valores primitivos dos value objects (ex: `TamanhoIndentacao.Valor`)
 * e repassa os enums diretamente, já que são parte do contrato público da camada.
 */
export const PerfilFormatacaoMapeador = {
    ParaResposta(entidade: PerfilFormatacao): PerfilFormatacaoResposta {
        return {
            tamanhoIndentacao: entidade.TamanhoIndentacao.Valor,
            tipoAspas: entidade.TipoAspas,
            modoQuebra: entidade.ModoQuebra,
        };
    },
} as const;
