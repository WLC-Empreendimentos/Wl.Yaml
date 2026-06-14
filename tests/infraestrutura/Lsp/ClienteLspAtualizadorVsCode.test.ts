import type { CancellationToken } from 'vscode';
import type { BaseLanguageClient } from 'vscode-languageclient';
import { ClienteLspAtualizadorVsCode } from '../../../src/infraestrutura/Lsp/ClienteLspAtualizadorVsCode';
import { AssociacaoSchema } from '../../../src/nucleo/Entidades/AssociacaoSchema';
import { UriSchema } from '../../../src/nucleo/ObjetosDeValor/UriSchema';
import { PadraoArquivo } from '../../../src/nucleo/ObjetosDeValor/PadraoArquivo';

const ct = {} as CancellationToken;

function criarCliente(): {
    mock: { sendNotification: jest.Mock };
    cliente: ClienteLspAtualizadorVsCode;
} {
    const mock = {
        sendNotification: jest.fn<Promise<void>, [string, unknown]>().mockResolvedValue(undefined),
    };
    return { mock, cliente: new ClienteLspAtualizadorVsCode(mock as unknown as BaseLanguageClient) };
}

function criarAssociacao(uri: string, padrao: string): AssociacaoSchema {
    return new AssociacaoSchema(new UriSchema(uri), new PadraoArquivo(padrao));
}

describe('ClienteLspAtualizadorVsCodeTest', () => {
    it('AtualizarSchemasAsync_AssociacaoUnica_EnviaNotificacaoJsonSchemaAssociations', async () => {
        const { mock, cliente } = criarCliente();

        await cliente.AtualizarSchemasAsync(
            [criarAssociacao('https://json.schemastore.org/schema.json', '**/*.yaml')],
            ct,
        );

        expect(mock.sendNotification).toHaveBeenCalledWith(
            'json/schemaAssociations',
            expect.any(Object),
        );
    });

    it('AtualizarSchemasAsync_ListaVazia_EnviaMapaVazio', async () => {
        const { mock, cliente } = criarCliente();

        await cliente.AtualizarSchemasAsync([], ct);

        expect(mock.sendNotification).toHaveBeenCalledWith('json/schemaAssociations', {});
    });
});
