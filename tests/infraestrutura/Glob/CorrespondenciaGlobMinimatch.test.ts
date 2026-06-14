import { CorrespondenciaGlobMinimatch } from '../../../src/infraestrutura/Glob/CorrespondenciaGlobMinimatch';

const glob = new CorrespondenciaGlobMinimatch();

describe('CorrespondenciaGlobMinimatchTest', () => {
    it('Corresponde_PadraoCoringa_RetornaTrue', () => {
        expect(glob.Corresponde('/workspace/config.yaml', '**/*.yaml')).toBe(true);
    });

    it('Corresponde_ExtensaoDiferente_RetornaFalse', () => {
        expect(glob.Corresponde('/workspace/config.json', '**/*.yaml')).toBe(false);
    });

    it('Corresponde_PadraoExato_RetornaTrue', () => {
        expect(glob.Corresponde('config.yaml', 'config.yaml')).toBe(true);
    });

    it('Corresponde_PadraoExatoDiferente_RetornaFalse', () => {
        expect(glob.Corresponde('outro.yaml', 'config.yaml')).toBe(false);
    });

    it('Corresponde_PadraoSubdiretorio_RetornaTrue', () => {
        expect(glob.Corresponde('charts/values.yaml', 'charts/*.yaml')).toBe(true);
    });

    it('Corresponde_PadraoSubdiretorioArquivoNaRaiz_RetornaFalse', () => {
        expect(glob.Corresponde('values.yaml', 'charts/*.yaml')).toBe(false);
    });

    it('Corresponde_ArquivoPonto_RetornaTrue', () => {
        expect(glob.Corresponde('.github/workflows/ci.yaml', '**/*.yaml')).toBe(true);
    });
});
