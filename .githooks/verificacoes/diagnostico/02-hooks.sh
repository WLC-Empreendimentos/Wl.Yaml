# shellcheck shell=bash
# 02 — Arquivos de hooks existem e são executáveis.
export VY_TITULO="Hooks"

vy_verificar() {
    local hook arquivo
    for hook in pre-commit prepare-commit-msg commit-msg pre-push pre-rebase; do
        arquivo="$RAIZ/.githooks/$hook"
        if [[ ! -f "$arquivo" ]]; then
            vy_falha "$hook não existe"
        elif [[ ! -x "$arquivo" ]]; then
            vy_falha "$hook existe mas NÃO é executável — rode: chmod +x $arquivo"
        else
            vy_ok "$hook (executável)"
        fi
    done
}
