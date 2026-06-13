# shellcheck shell=bash
# 07 — Coerência entre "!" no título e rodapé "BREAKING CHANGE:".
export VY_TITULO="BREAKING CHANGE coerente"

vy_verificar() {
    [[ $TITULO_VALIDO -eq 0 ]] && return

    local tem_footer
    tem_footer=$(echo "$MSG_COMPLETA" | grep -cE '^BREAKING[ -]CHANGE: ' || true)

    if [[ -n "$BANG" && "$tem_footer" -eq 0 ]]; then
        vy_msg_erro "Título tem '!' mas falta o rodapé 'BREAKING CHANGE: <descrição>'"
    fi
    if [[ -z "$BANG" && "$tem_footer" -gt 0 ]]; then
        vy_msg_erro "Rodapé 'BREAKING CHANGE:' presente mas falta '!' no título"
    fi
}
