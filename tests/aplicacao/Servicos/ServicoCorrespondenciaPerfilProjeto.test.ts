import type { CancellationToken } from 'vscode';
import type { IRepositorioPerfilProjeto } from '../../../src/nucleo/Interfaces/Repositorios/IRepositorioPerfilProjeto';
import type { ICorrespondenciaGlob } from '../../../src/nucleo/Interfaces/Servicos/ICorrespondenciaGlob';
import {
    ServicoCorrespondenciaPerfilProjeto,
} from '../../../src/aplicacao/Servicos/ServicoCorrespondenciaPerfilProjeto';
import { PerfilProjeto } from '../../../src/nucleo/Entidades/PerfilProjeto';
import { PerfilFormatacao } from '../../../src/nucleo/Entidades/PerfilFormatacao';
import { PadraoArquivo } from '../../../src/nucleo/ObjetosDeValor/PadraoArquivo';
import { TamanhoIndentacao } from '../../../src/nucleo/ObjetosDeValor/TamanhoIndentacao';
import { TipoAspas } from '../../../src/nucleo/Enums/TipoAspas';
import { ModoQuebra } from '../../../src/nucleo/Enums/ModoQuebra';

const ct = {} as CancellationToken;

const URI_WORKSPACE = '/workspace';
const URI_DOCUMENTO = '/workspace/config.yaml';

function criarPerfil(): PerfilFormatacao {
    return new PerfilFormatacao(
        new PadraoArquivo('**/*.yaml'),
        new TamanhoIndentacao(2),
        TipoAspas.Simples,
        ModoQuebra.Nunca,
    );
}

describe('ServicoCorrespondenciaPerfilProjetoTest', () => {
    let repositorioPerfil: jest.Mocked<IRepositorioPerfilProjeto>;
    let corresponde: jest.Mock;
    let glob: ICorrespondenciaGlob;

    beforeEach(() => {
        corresponde = jest.fn();
        repositorioPerfil = { ObterAsync: jest.fn() };
        glob = { Corresponde: corresponde };
    });

    function criarServico(): ServicoCorrespondenciaPerfilProjeto {
        return new ServicoCorrespondenciaPerfilProjeto(repositorioPerfil, glob);
    }

    it('ObterPerfilCorrespondente_ArquivoPerfilAusente_RetornaUndefined', async () => {
        repositorioPerfil.ObterAsync.mockResolvedValue(undefined);

        const resultado = await criarServico().ObterPerfilCorrespondenteAsync(URI_WORKSPACE, URI_DOCUMENTO, ct);

        expect(resultado).toBeUndefined();
    });

    it('ObterPerfilCorrespondente_SemCorrespondencia_RetornaUndefined', async () => {
        repositorioPerfil.ObterAsync.mockResolvedValue(new PerfilProjeto([criarPerfil()]));
        corresponde.mockReturnValue(false);

        const resultado = await criarServico().ObterPerfilCorrespondenteAsync(URI_WORKSPACE, URI_DOCUMENTO, ct);

        expect(resultado).toBeUndefined();
    });

    it('ObterPerfilCorrespondente_ComCorrespondencia_RetornaPerfil', async () => {
        const perfil = criarPerfil();
        repositorioPerfil.ObterAsync.mockResolvedValue(new PerfilProjeto([perfil]));
        corresponde.mockReturnValue(true);

        const resultado = await criarServico().ObterPerfilCorrespondenteAsync(URI_WORKSPACE, URI_DOCUMENTO, ct);

        expect(resultado).toBe(perfil);
    });

    it('ObterPerfilCorrespondente_ArquivoPerfilAusente_NaoConsultaGlob', async () => {
        repositorioPerfil.ObterAsync.mockResolvedValue(undefined);

        await criarServico().ObterPerfilCorrespondenteAsync(URI_WORKSPACE, URI_DOCUMENTO, ct);

        expect(corresponde).not.toHaveBeenCalled();
    });
});
