import { PerfilNaoEncontradoExcecao } from '../../../../src/nucleo/Excecoes/Perfil/PerfilNaoEncontradoExcecao';
import { NaoEncontradoExcecao } from '../../../../src/nucleo/Excecoes/Base/NaoEncontradoExcecao';
import { YamlExtensaoExcecao } from '../../../../src/nucleo/Excecoes/Base/YamlExtensaoExcecao';

describe('PerfilNaoEncontradoExcecaoTest', () => {
    test('Construtor_NomePerfilValido_FormataMensagemComNomeDoPerfil', () => {
        const excecao = new PerfilNaoEncontradoExcecao('producao');

        expect(excecao.message).toBe("Perfil 'producao' não encontrado no arquivo .yaml-profile.json.");
    });

    test('Construtor_NomePerfilValido_DefineNameComoPerfilNaoEncontradoExcecao', () => {
        const excecao = new PerfilNaoEncontradoExcecao('producao');

        expect(excecao.name).toBe('PerfilNaoEncontradoExcecao');
    });

    test('Instancia_PerfilNaoEncontradoExcecao_EhInstanceofNaoEncontradoExcecao', () => {
        const excecao = new PerfilNaoEncontradoExcecao('producao');

        expect(excecao).toBeInstanceOf(NaoEncontradoExcecao);
    });

    test('Instancia_PerfilNaoEncontradoExcecao_EhInstanceofYamlExtensaoExcecao', () => {
        const excecao = new PerfilNaoEncontradoExcecao('producao');

        expect(excecao).toBeInstanceOf(YamlExtensaoExcecao);
    });

    test('Instancia_PerfilNaoEncontradoExcecao_EhInstanceofError', () => {
        const excecao = new PerfilNaoEncontradoExcecao('producao');

        expect(excecao).toBeInstanceOf(Error);
    });
});
