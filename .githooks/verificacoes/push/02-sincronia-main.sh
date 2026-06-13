# shellcheck shell=bash
# 02 — Avisa se a branch local está atrás de origin/main.
export VY_TITULO="Sincronia com origin/main"

vy_verificar() {
    git fetch --quiet "$REMOTE" main 2>/dev/null || true

    if ! git rev-parse --verify --quiet "${REMOTE}/main" >/dev/null; then
        vy_pular "Sem origin/main acessível"
        return
    fi

    local base head_main atras
    base=$(git merge-base HEAD "${REMOTE}/main" 2>/dev/null || echo "")
    head_main=$(git rev-parse "${REMOTE}/main" 2>/dev/null || echo "")

    if [[ -n "$base" && "$base" != "$head_main" ]]; then
        atras=$(git rev-list --count "${base}..${head_main}" 2>/dev/null || echo 0)
        if (( atras > 0 )); then
            aviso "Branch está $atras commit(s) atrás de origin/main — considere rebase"
        else
            vy_ok "Atualizada"
        fi
    else
        vy_ok "Atualizada"
    fi
}
