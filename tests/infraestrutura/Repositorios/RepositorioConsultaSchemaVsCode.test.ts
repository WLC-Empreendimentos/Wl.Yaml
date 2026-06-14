import type { CancellationToken } from 'vscode';
import type { ICorrespondenciaGlob } from '../../../src/nucleo/Interfaces/Servicos/ICorrespondenciaGlob';
import { __vscodeMock } from '../../__mocks__/vscode';
import {
    RepositorioConsultaSchemaVsCode,
} from '../../../src/infraestrutura/Repositorios/RepositorioConsultaSchemaVsCode';
import { DocumentoYaml } from '../../../src/nucleo/Entidades/DocumentoYaml';

const ct = {} as CancellationToken;

const URI_DOCUMENTO = '/workspace/config.yaml';
const URI_SCHEMA = 'https://json.schemastore.org/github-workflow';
const PADRAO = '**/*.yaml';

function criarRepositorio(correspondencia: jest.Mocked<ICorrespondenciaGlob>): RepositorioConsultaSchemaVsCode {
    return new RepositorioConsultaSchemaVsCode(correspondencia);
}

function criarDocumento(uri = URI_DOCUMENTO): DocumentoYaml {
    return new DocumentoYaml(uri);
}

describe('RepositorioConsultaSchemaVsCodeTest', () => {
    let corresponde: jest.Mock<boolean, [string, string]>;
    let correspondencia: jest.Mocked<ICorrespondenciaGlob>;

    beforeEach(() => {
        __vscodeMock.limpar();
        corresponde = jest.fn<boolean, [string, string]>();
        correspondencia = { Corresponde: corresponde };
    });

    it('ObterPorDocumento_SemSchemasConfigurados_RetornaUndefined', async () => {
        const resultado = await criarRepositorio(correspondencia)
            .ObterPorDocumentoAsync(criarDocumento(), ct);

        expect(resultado).toBeUndefined();
    });

    it('ObterPorDocumento_SchemaComPadraoString_CorrespondeDocumento_RetornaAssociacao', async () => {
        __vscodeMock.definirConfiguracao('yaml', 'schemas', { [URI_SCHEMA]: PADRAO });
        corresponde.mockReturnValue(true);

        const resultado = await criarRepositorio(correspondencia)
            .ObterPorDocumentoAsync(criarDocumento(), ct);

        expect(resultado?.UriSchema.Valor).toBe(URI_SCHEMA);
        expect(resultado?.PadraoArquivo.Valor).toBe(PADRAO);
    });

    it('ObterPorDocumento_SchemaComPadraoArray_CorrespondeSegundoPadrao_RetornaAssociacao', async () => {
        const padraoYml = '**/*.yml';
        __vscodeMock.definirConfiguracao('yaml', 'schemas', { [URI_SCHEMA]: [PADRAO, padraoYml] });
        corresponde.mockImplementation((_uri, padrao) => padrao === padraoYml);

        const resultado = await criarRepositorio(correspondencia)
            .ObterPorDocumentoAsync(criarDocumento(), ct);

        expect(resultado?.PadraoArquivo.Valor).toBe(padraoYml);
    });

    it('ObterPorDocumento_SchemaConfigurado_NaoCorresponde_RetornaUndefined', async () => {
        __vscodeMock.definirConfiguracao('yaml', 'schemas', { [URI_SCHEMA]: PADRAO });
        corresponde.mockReturnValue(false);

        const resultado = await criarRepositorio(correspondencia)
            .ObterPorDocumentoAsync(criarDocumento(), ct);

        expect(resultado).toBeUndefined();
    });

    it('ObterPorDocumento_MultiplosSchemasConfigurados_RetornaPrimeiroQueCorresponde', async () => {
        const uriOutroSchema = 'https://json.schemastore.org/github-action';
        __vscodeMock.definirConfiguracao('yaml', 'schemas', {
            [URI_SCHEMA]: PADRAO,
            [uriOutroSchema]: '**/*.yml',
        });
        corresponde.mockImplementation((_uri, padrao) => padrao === PADRAO);

        const resultado = await criarRepositorio(correspondencia)
            .ObterPorDocumentoAsync(criarDocumento(), ct);

        expect(resultado?.UriSchema.Valor).toBe(URI_SCHEMA);
    });

    it('ObterPorDocumento_CorrespondeDocumento_PassaUriDocumentoParaCorrespondencia', async () => {
        __vscodeMock.definirConfiguracao('yaml', 'schemas', { [URI_SCHEMA]: PADRAO });
        corresponde.mockReturnValue(false);

        await criarRepositorio(correspondencia).ObterPorDocumentoAsync(criarDocumento(), ct);

        expect(corresponde).toHaveBeenCalledWith(URI_DOCUMENTO, PADRAO);
    });
});
