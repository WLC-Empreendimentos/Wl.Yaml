# shellcheck shell=bash
# 03 — Título não pode exceder VY_COMMIT_TITULO_MAX caracteres.
export VY_TITULO="Tamanho do título"

vy_verificar() {
    [[ $TITULO_VALIDO -eq 0 ]] && return
    local tam=${#TITULO}
    if (( tam > VY_COMMIT_TITULO_MAX )); then
        vy_msg_erro "Título com $tam caracteres (máximo $VY_COMMIT_TITULO_MAX)"
    fi
}
