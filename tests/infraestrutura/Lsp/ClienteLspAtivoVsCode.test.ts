import type { BaseLanguageClient } from 'vscode-languageclient';
import { State } from 'vscode-languageclient';
import { ClienteLspAtivoVsCode } from '../../../src/infraestrutura/Lsp/ClienteLspAtivoVsCode';

function criarCliente(state: State): ClienteLspAtivoVsCode {
    const mock = { state };
    return new ClienteLspAtivoVsCode(mock as unknown as BaseLanguageClient);
}

describe('ClienteLspAtivoVsCodeTest', () => {
    it('EstaAtivo_ClienteRunning_RetornaTrue', () => {
        expect(criarCliente(State.Running).EstaAtivo()).toBe(true);
    });

    it('EstaAtivo_ClienteStopped_RetornaFalse', () => {
        expect(criarCliente(State.Stopped).EstaAtivo()).toBe(false);
    });

    it('EstaAtivo_ClienteStarting_RetornaFalse', () => {
        expect(criarCliente(State.Starting).EstaAtivo()).toBe(false);
    });
});
