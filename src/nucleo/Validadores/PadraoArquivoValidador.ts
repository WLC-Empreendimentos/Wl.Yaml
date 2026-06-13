import { PadraoArquivoInvalidoExcecao } from '../Excecoes/Perfil/PadraoArquivoInvalidoExcecao';

export const PadraoArquivoValidador = {
    Validar(valor: string): void {
        if (valor.trim().length === 0) {
            throw new PadraoArquivoInvalidoExcecao();
        }
    },
} as const;
