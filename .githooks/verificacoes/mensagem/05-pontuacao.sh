# shellcheck shell=bash
# 05 — Título não termina com ponto final nem com espaço.
export VY_TITULO="Pontuação do título"

vy_verificar() {
    [[ $TITULO_VALIDO -eq 0 ]] && return
    [[ "$DESCRICAO" =~ \.$ ]] && vy_msg_erro "Título não deve terminar com ponto final"
    [[ "$TITULO" =~ [[:space:]]$ ]] && vy_msg_erro "Título não deve terminar com espaço"
}
