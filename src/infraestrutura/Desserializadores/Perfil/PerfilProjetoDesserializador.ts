import { PerfilProjeto } from '../../../nucleo/Entidades/PerfilProjeto';
import { ValidadorObjetoJson } from '../Json/Validadores/ValidadorObjetoJson';
import { LeitorArrayJson } from '../Json/Leitores/LeitorArrayJson';
import { PerfilFormatacaoDesserializador } from './PerfilFormatacaoDesserializador';

const CONTEXTO_RAIZ = 'arquivo de perfil';

/**
 * Converte o JSON bruto do `.yaml-profile.json` em `PerfilProjeto`.
 *
 * @remarks
 * Delega validação estrutural e extração de campos aos componentes especializados.
 * Razão de mudança exclusiva: alteração no formato raiz do arquivo de perfil.
 */
export const PerfilProjetoDesserializador = {
    /**
     * Desserializa o conteúdo JSON bruto do `.yaml-profile.json`.
     *
     * @param raw - Valor obtido de `JSON.parse` do arquivo.
     * @returns Entidade com todos os perfis validados e construídos.
     * @throws {PerfilInvalidoExcecao} Quando a estrutura raiz é inválida.
     */
    Desserializar(raw: unknown): PerfilProjeto {
        const obj = ValidadorObjetoJson.Validar(raw, CONTEXTO_RAIZ);
        const rawPerfis = LeitorArrayJson.Ler(obj, 'perfis', CONTEXTO_RAIZ);
        return new PerfilProjeto(
            rawPerfis.map((p, i) => PerfilFormatacaoDesserializador.Desserializar(p, String(i))),
        );
    },
} as const;
