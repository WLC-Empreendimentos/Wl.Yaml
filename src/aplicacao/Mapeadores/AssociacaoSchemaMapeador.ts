import type { AssociacaoSchema } from '../../nucleo/Entidades/AssociacaoSchema';
import type { AssociacaoSchemaResposta } from '../DTOs/Saida/Schema/AssociacaoSchemaResposta';

/**
 * Converte a entidade `AssociacaoSchema` para o DTO de saída.
 *
 * @remarks
 * Extrai os valores primitivos dos value objects `UriSchema` e `PadraoArquivo`,
 * produzindo um DTO plano seguro para cruzar a fronteira de apresentação.
 */
export const AssociacaoSchemaMapeador = {
    ParaResposta(entidade: AssociacaoSchema): AssociacaoSchemaResposta {
        return {
            uriSchema: entidade.UriSchema.Valor,
            padraoArquivo: entidade.PadraoArquivo.Valor,
        };
    },
} as const;
