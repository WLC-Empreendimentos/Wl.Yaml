import { UriSchemaInvalidaExcecao } from '../Excecoes/Schema/UriSchemaInvalidaExcecao';

export const UriSchemaValidador = {
    Validar(valor: string): void {
        if (valor.trim().length === 0) {
            throw new UriSchemaInvalidaExcecao();
        }
    },
} as const;
