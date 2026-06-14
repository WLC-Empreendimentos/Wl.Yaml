import type { CancellationToken } from 'vscode';
import type { IRepositorioConfiguracoes } from '../../../src/nucleo/Interfaces/Repositorios/IRepositorioConfiguracoes';
import type {
    ServicoCorrespondenciaPerfilProjeto,
} from '../../../src/aplicacao/Servicos/ServicoCorrespondenciaPerfilProjeto';
import { ServicoResolucaoFormatacao } from '../../../src/aplicacao/Servicos/ServicoResolucaoFormatacao';
import { PerfilFormatacao } from '../../../src/nucleo/Entidades/PerfilFormatacao';
import { PadraoArquivo } from '../../../src/nucleo/ObjetosDeValor/PadraoArquivo';
import { TamanhoIndentacao } from '../../../src/nucleo/ObjetosDeValor/TamanhoIndentacao';
import { TipoAspas } from '../../../src/nucleo/Enums/TipoAspas';
import { ModoQuebra } from '../../../src/nucleo/Enums/ModoQuebra';

const ct = {} as CancellationToken;

const REQUISICAO = { uriDocumento: '/workspace/config.yaml', uriWorkspace: '/workspace' };

function criarPerfil(indentacao = 2): PerfilFormatacao {
    return new PerfilFormatacao(
        new PadraoArquivo('**/*.yaml'),
        new TamanhoIndentacao(indentacao),
        TipoAspas.Simples,
        ModoQuebra.Nunca,
    );
}

describe('ServicoResolucaoFormatacaoTest', () => {
    let obterPerfilCorrespondente: jest.Mock<Promise<PerfilFormatacao | undefined>, []>;
    let obterPerfilAsync: jest.Mock;
    let correspondencia: ServicoCorrespondenciaPerfilProjeto;
    let repositorioConfiguracoes: IRepositorioConfiguracoes;

    beforeEach(() => {
        obterPerfilCorrespondente = jest.fn<Promise<PerfilFormatacao | undefined>, []>();
        obterPerfilAsync = jest.fn();
        correspondencia = {
            ObterPerfilCorrespondenteAsync: obterPerfilCorrespondente,
        } as unknown as ServicoCorrespondenciaPerfilProjeto;
        repositorioConfiguracoes = { FormatacaoHabilitada: jest.fn(), ObterPerfilAsync: obterPerfilAsync };
    });

    function criarServico(): ServicoResolucaoFormatacao {
        return new ServicoResolucaoFormatacao(correspondencia, repositorioConfiguracoes);
    }

    it('ResolverPerfilEfetivo_CorrespondenciaEncontrada_RetornaPerfilDoProjeto', async () => {
        obterPerfilCorrespondente.mockResolvedValue(criarPerfil(4));

        const resposta = await criarServico().ResolverPerfilEfetivoAsync(REQUISICAO, ct);

        expect(resposta?.tamanhoIndentacao).toBe(4);
    });

    it('ResolverPerfilEfetivo_SemCorrespondencia_RetornaPerfilDasConfiguracoes', async () => {
        obterPerfilCorrespondente.mockResolvedValue(undefined);
        obterPerfilAsync.mockResolvedValue(criarPerfil(2));

        const resposta = await criarServico().ResolverPerfilEfetivoAsync(REQUISICAO, ct);

        expect(resposta?.tamanhoIndentacao).toBe(2);
    });

    it('ResolverPerfilEfetivo_SemCorrespondenciaEConfiguracoesSemPerfil_RetornaUndefined', async () => {
        obterPerfilCorrespondente.mockResolvedValue(undefined);
        obterPerfilAsync.mockResolvedValue(undefined);

        const resposta = await criarServico().ResolverPerfilEfetivoAsync(REQUISICAO, ct);

        expect(resposta).toBeUndefined();
    });

    it('ResolverPerfilEfetivo_CorrespondenciaEncontrada_NaoConsultaConfiguracoes', async () => {
        obterPerfilCorrespondente.mockResolvedValue(criarPerfil());

        await criarServico().ResolverPerfilEfetivoAsync(REQUISICAO, ct);

        expect(obterPerfilAsync).not.toHaveBeenCalled();
    });
});
