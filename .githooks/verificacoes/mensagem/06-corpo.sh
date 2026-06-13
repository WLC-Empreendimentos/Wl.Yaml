# shellcheck shell=bash
# 06 — Linha em branco entre título e corpo + comprimento sugerido das linhas.
export VY_TITULO="Corpo da mensagem"

vy_verificar() {
    [[ $TITULO_VALIDO -eq 0 ]] && return

    if [[ -n "$SEGUNDA_LINHA" ]]; then
        vy_msg_erro "Deve haver linha em branco entre o título e o corpo"
    fi

    local linhas_longas
    linhas_longas=$(echo "$MSG_COMPLETA" | tail -n +3 \
        | awk -v lim="$VY_COMMIT_CORPO_SUGERIDO" 'length > lim {print NR+2": "length" chars"}' \
        || true)
    if [[ -n "$linhas_longas" ]]; then
        vy_msg_aviso "Linhas do corpo > $VY_COMMIT_CORPO_SUGERIDO chars (sugerido, não bloqueia):"
        local ll
        while IFS= read -r ll; do vy_msg_aviso "  $ll"; done <<<"$linhas_longas"
    fi
}
