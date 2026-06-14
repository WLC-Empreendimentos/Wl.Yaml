import { DocumentoYaml } from '../../../src/nucleo/Entidades/DocumentoYaml';
import { UriDocumentoInvalidaExcecao } from
    '../../../src/nucleo/Excecoes/Documento/UriDocumentoInvalidaExcecao';

describe('DocumentoYamlTest', () => {
    test('Construtor_ComUriValida_ArmazenaUri', () => {
        const documento = new DocumentoYaml('file:///projeto/config.yaml');

        expect(documento.Uri).toBe('file:///projeto/config.yaml');
    });

    test('Construtor_ComUriVazia_LancaUriDocumentoInvalidaExcecao', () => {
        expect(() => new DocumentoYaml('')).toThrow(UriDocumentoInvalidaExcecao);
    });

    test('Construtor_ComUriSomenteEspacos_LancaUriDocumentoInvalidaExcecao', () => {
        expect(() => new DocumentoYaml('   ')).toThrow(UriDocumentoInvalidaExcecao);
    });

    test('Uri_AposConstrucao_RetornaUriInformada', () => {
        const uri = 'file:///projeto/k8s/deployment.yaml';
        const documento = new DocumentoYaml(uri);

        expect(documento.Uri).toBe(uri);
    });

    test('Iguala_ComMesmaUri_RetornaVerdadeiro', () => {
        const documento = new DocumentoYaml('file:///projeto/config.yaml');
        const outro = new DocumentoYaml('file:///projeto/config.yaml');

        expect(documento.Iguala(outro)).toBe(true);
    });

    test('Iguala_ComUriDiferente_RetornaFalso', () => {
        const documento = new DocumentoYaml('file:///projeto/config.yaml');
        const outro = new DocumentoYaml('file:///projeto/outros.yaml');

        expect(documento.Iguala(outro)).toBe(false);
    });
});
