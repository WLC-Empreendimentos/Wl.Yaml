# shellcheck shell=bash
# 00 — Valida que o nome da branch de origem segue o padrão.
export VY_TITULO="Nome da branch"

vy_verificar() {
    local branch
    branch=$(vy_branch_atual)

    if [[ "$branch" =~ $VY_BRANCH_PADRAO ]]; then
        vy_ok "Branch '$branch'"
    else
        falha "Nome de branch inválido: '$branch'.
        Use: feat/<escopo>/<desc>, fix/<escopo>/<desc>, refactor/...,
            docs/..., build/..., config/..., chore/...
        Veja: docs/padronizacao/runtime/COMMITS.md"
    fi
}
