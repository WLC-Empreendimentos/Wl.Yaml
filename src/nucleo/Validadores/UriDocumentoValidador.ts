import { UriDocumentoInvalidaExcecao } from '../Excecoes/Documento/UriDocumentoInvalidaExcecao';

export const UriDocumentoValidador = {
    Validar(uri: string): void {
        if (uri.trim().length === 0) {
            throw new UriDocumentoInvalidaExcecao();
        }
    },
} as const;
