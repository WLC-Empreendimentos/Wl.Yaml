import {
    PerfilFormatacaoDesserializador,
} from '../../../../src/infraestrutura/Desserializadores/Perfil/PerfilFormatacaoDesserializador';
import { TipoAspas } from '../../../../src/nucleo/Enums/TipoAspas';
import { ModoQuebra } from '../../../../src/nucleo/Enums/ModoQuebra';
import { PerfilInvalidoExcecao } from '../../../../src/nucleo/Excecoes/Perfil/PerfilInvalidoExcecao';

const POS = '0';

const OBJETO_VALIDO = {
    padraoArquivo: '**/*.yaml',
    tamanhoIndentacao: 2,
    tipoAspas: 'single',
    modoQuebra: 'preserve',
};

describe('PerfilFormatacaoDesserializadorTest', () => {
    it('Desserializar_ObjetoValido_RetornaEntidadeComTodosOsCampos', () => {
        const perfil = PerfilFormatacaoDesserializador.Desserializar(OBJETO_VALIDO, POS);

        expect(perfil.PadraoArquivo.Valor).toBe('**/*.yaml');
        expect(perfil.TamanhoIndentacao.Valor).toBe(2);
        expect(perfil.TipoAspas).toBe(TipoAspas.Simples);
        expect(perfil.ModoQuebra).toBe(ModoQuebra.Preservar);
    });

    it('Desserializar_TamanhoIndentacaoInvalido_LancaPerfilInvalidoExcecao', () => {
        expect(() => PerfilFormatacaoDesserializador.Desserializar(
            { ...OBJETO_VALIDO, tamanhoIndentacao: 0 }, POS,
        )).toThrow(PerfilInvalidoExcecao);
    });

    it('Desserializar_PadraoArquivoVazio_LancaPerfilInvalidoExcecao', () => {
        expect(() => PerfilFormatacaoDesserializador.Desserializar(
            { ...OBJETO_VALIDO, padraoArquivo: '   ' }, POS,
        )).toThrow(PerfilInvalidoExcecao);
    });
});
