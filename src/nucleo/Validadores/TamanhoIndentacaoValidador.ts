import { TamanhoIndentacaoInvalidoExcecao } from '../Excecoes/Perfil/TamanhoIndentacaoInvalidoExcecao';

const MINIMO = 1;
const MAXIMO = 8;

export const TamanhoIndentacaoValidador = {
    Validar(valor: number): void {
        if (!Number.isInteger(valor) || valor < MINIMO || valor > MAXIMO) {
            throw new TamanhoIndentacaoInvalidoExcecao();
        }
    },
} as const;
