import { PerfilFormatacaoMapeador } from '../../../src/aplicacao/Mapeadores/PerfilFormatacaoMapeador';
import { PerfilFormatacao } from '../../../src/nucleo/Entidades/PerfilFormatacao';
import { PadraoArquivo } from '../../../src/nucleo/ObjetosDeValor/PadraoArquivo';
import { TamanhoIndentacao } from '../../../src/nucleo/ObjetosDeValor/TamanhoIndentacao';
import { TipoAspas } from '../../../src/nucleo/Enums/TipoAspas';
import { ModoQuebra } from '../../../src/nucleo/Enums/ModoQuebra';

function criarPerfil(
    indentacao: number,
    tipoAspas: TipoAspas,
    modoQuebra: ModoQuebra,
): PerfilFormatacao {
    return new PerfilFormatacao(
        new PadraoArquivo('**/*.yaml'),
        new TamanhoIndentacao(indentacao),
        tipoAspas,
        modoQuebra,
    );
}

describe('PerfilFormatacaoMapeadorTest', () => {
    it('ParaResposta_EntidadeValida_MapeiaIndentacaoCorretamente', () => {
        const entidade = criarPerfil(4, TipoAspas.Simples, ModoQuebra.Nunca);

        const resposta = PerfilFormatacaoMapeador.ParaResposta(entidade);

        expect(resposta.tamanhoIndentacao).toBe(4);
    });

    it('ParaResposta_EntidadeValida_MapeiaTipoAspasCorretamente', () => {
        const entidade = criarPerfil(2, TipoAspas.Duplas, ModoQuebra.Nunca);

        const resposta = PerfilFormatacaoMapeador.ParaResposta(entidade);

        expect(resposta.tipoAspas).toBe(TipoAspas.Duplas);
    });

    it('ParaResposta_EntidadeValida_MapeiaModoQuebraCorretamente', () => {
        const entidade = criarPerfil(2, TipoAspas.Simples, ModoQuebra.Sempre);

        const resposta = PerfilFormatacaoMapeador.ParaResposta(entidade);

        expect(resposta.modoQuebra).toBe(ModoQuebra.Sempre);
    });
});
