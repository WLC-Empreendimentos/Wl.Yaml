import {
    PerfilProjetoDesserializador,
} from '../../../../src/infraestrutura/Desserializadores/Perfil/PerfilProjetoDesserializador';
import { PerfilInvalidoExcecao } from '../../../../src/nucleo/Excecoes/Perfil/PerfilInvalidoExcecao';

const PERFIL_VALIDO = {
    padraoArquivo: '**/*.yaml',
    tamanhoIndentacao: 2,
    tipoAspas: 'single',
    modoQuebra: 'preserve',
};

describe('PerfilProjetoDesserializadorTest', () => {
    it('Desserializar_EstruturaValida_RetornaPerfilComQuantidadeCorreta', () => {
        const raw = { perfis: [PERFIL_VALIDO, { ...PERFIL_VALIDO, padraoArquivo: '**/*.yml' }] };

        const resultado = PerfilProjetoDesserializador.Desserializar(raw);

        expect(resultado.Perfis).toHaveLength(2);
    });

    it('Desserializar_ListaVazia_RetornaPerfilSemEntradas', () => {
        const resultado = PerfilProjetoDesserializador.Desserializar({ perfis: [] });

        expect(resultado.Perfis).toHaveLength(0);
    });

    it('Desserializar_RawNaoEObjeto_LancaPerfilInvalidoExcecao', () => {
        expect(() => PerfilProjetoDesserializador.Desserializar(42))
            .toThrow(PerfilInvalidoExcecao);
    });

    it('Desserializar_RawNulo_LancaPerfilInvalidoExcecao', () => {
        expect(() => PerfilProjetoDesserializador.Desserializar(null))
            .toThrow(PerfilInvalidoExcecao);
    });

    it('Desserializar_SemCampoPerfis_LancaPerfilInvalidoExcecao', () => {
        expect(() => PerfilProjetoDesserializador.Desserializar({ outro: [] }))
            .toThrow(PerfilInvalidoExcecao);
    });

    it('Desserializar_PerfisNaoEArray_LancaPerfilInvalidoExcecao', () => {
        expect(() => PerfilProjetoDesserializador.Desserializar({ perfis: 'errado' }))
            .toThrow(PerfilInvalidoExcecao);
    });

    it('Desserializar_PerfilNaoEObjeto_LancaPerfilInvalidoExcecao', () => {
        expect(() => PerfilProjetoDesserializador.Desserializar({ perfis: [42] }))
            .toThrow(PerfilInvalidoExcecao);
    });
});
