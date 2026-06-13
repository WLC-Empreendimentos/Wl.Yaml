# shellcheck shell=bash
# 08 — Se a branch contém um ticket (ex.: feat/PROJ-42), sugerir
#      "Refs: #PROJ-42" no rodapé (apenas aviso).
export VY_TITULO="Refs do ticket extraído da branch"

vy_verificar() {
    [[ $TITULO_VALIDO -eq 0 ]] && return

    local branch
    branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "")
    if [[ "$branch" =~ /([A-Z]+-[0-9]+) ]]; then
        local ticket="${BASH_REMATCH[1]}"
        if ! echo "$MSG_COMPLETA" | grep -qE "(Refs|Closes|Fixes):.*#?$ticket"; then
            vy_msg_aviso "Branch contém '$ticket' — considere adicionar 'Refs: #$ticket' no rodapé"
        fi
    fi
}
