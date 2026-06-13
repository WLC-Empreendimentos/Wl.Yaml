# shellcheck shell=bash
# 02 — Escopo declarado deve estar na whitelist VY_ESCOPOS_VALIDOS.
export VY_TITULO="Escopo válido"

vy_verificar() {
    [[ $TITULO_VALIDO -eq 0 ]] && return
    [[ -z "$ESCOPO" ]] && return
    if ! vy_contem "$ESCOPO" "${VY_ESCOPOS_VALIDOS[@]}"; then
        vy_msg_erro "Escopo '$ESCOPO' não está na whitelist. Veja COMMITS.md §Escopos."
    fi
}
