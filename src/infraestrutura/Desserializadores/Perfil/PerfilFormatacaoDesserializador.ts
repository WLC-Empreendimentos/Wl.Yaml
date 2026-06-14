import { PerfilFormatacao } from '../../../nucleo/Entidades/PerfilFormatacao';
import { PadraoArquivo } from '../../../nucleo/ObjetosDeValor/PadraoArquivo';
import { TamanhoIndentacao } from '../../../nucleo/ObjetosDeValor/TamanhoIndentacao';
import { PerfilMalFormadoExcecao } from '../../../nucleo/Excecoes/Perfil/PerfilMalFormadoExcecao';
import { ValidadorObjetoJson } from '../Json/Validadores/ValidadorObjetoJson';
import { LeitorStringJson } from '../Json/Leitores/LeitorStringJson';
import { LeitorNumeroJson } from '../Json/Leitores/LeitorNumeroJson';
import { TipoAspasDesserializador } from './TipoAspasDesserializador';
import { ModoQuebraDesserializador } from './ModoQuebraDesserializador';

/**
 * Converte um objeto JSON bruto em `PerfilFormatacao`.
 *
 * @remarks
 * Delega validação estrutural, extração de campos e conversão de enumerações
 * aos componentes especializados. Razão de mudança exclusiva: alteração no
 * conjunto de campos esperados por entrada de perfil no arquivo.
 */
export const PerfilFormatacaoDesserializador = {
    /**
     * Desserializa um objeto JSON bruto para `PerfilFormatacao`.
     *
     * @param raw - Objeto bruto extraído do JSON do `.yaml-profile.json`.
     * @param posicao - Posição do perfil no array, usada nas mensagens de erro.
     * @returns Entidade construída com os valores validados.
     * @throws {PerfilMalFormadoExcecao} Quando o objeto está malformado ou contém valores inválidos.
     */
    Desserializar(raw: unknown, posicao: string): PerfilFormatacao {
        const contexto = `perfis[${posicao}]`;
        const obj = ValidadorObjetoJson.Validar(raw, contexto);
        const padraoArquivo = LeitorStringJson.Ler(obj, 'padraoArquivo', contexto);
        const tamanhoIndentacao = LeitorNumeroJson.Ler(obj, 'tamanhoIndentacao', contexto);
        const tipoAspas = TipoAspasDesserializador.Desserializar(
            LeitorStringJson.Ler(obj, 'tipoAspas', contexto), contexto,
        );
        const modoQuebra = ModoQuebraDesserializador.Desserializar(
            LeitorStringJson.Ler(obj, 'modoQuebra', contexto), contexto,
        );

        try {
            return new PerfilFormatacao(
                new PadraoArquivo(padraoArquivo),
                new TamanhoIndentacao(tamanhoIndentacao),
                tipoAspas,
                modoQuebra,
            );
        } catch (erro: unknown) {
            throw new PerfilMalFormadoExcecao(contexto, erro);
        }
    },
} as const;
