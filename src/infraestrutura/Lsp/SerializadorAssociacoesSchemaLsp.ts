import type { AssociacaoSchema } from '../../nucleo/Entidades/AssociacaoSchema';

/**
 * Converte uma lista de `AssociacaoSchema` para o mapa esperado pela
 * notificação `json/schemaAssociations` do yaml-language-server.
 *
 * @remarks
 * Razão de mudança exclusiva: alteração no formato do payload da notificação
 * de schemas — por exemplo, mudança para um array de objetos em vez de
 * `Record<string, string[]>`.
 */
export const SerializadorAssociacoesSchemaLsp = {
    /**
     * Serializa associações para `Record<uri, padroes[]>`, agrupando múltiplas
     * associações com a mesma URI em um único array de padrões.
     *
     * @param associacoes - Lista de associações a serializar.
     * @returns Mapa URI → padrões de arquivo.
     */
    Serializar(associacoes: readonly AssociacaoSchema[]): Record<string, string[]> {
        const mapa: Record<string, string[]> = {};
        for (const assoc of associacoes) {
            const uri = assoc.UriSchema.Valor;
            (mapa[uri] ??= []).push(assoc.PadraoArquivo.Valor);
        }
        return mapa;
    },
} as const;
