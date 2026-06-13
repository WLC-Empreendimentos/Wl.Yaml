# shellcheck shell=bash
# 01 — Bloqueia commit direto em branches protegidas.
export VY_TITULO="Branch protegida"

vy_verificar() {
    local branch
    branch=$(vy_branch_atual)
    if vy_contem "$branch" "${VY_BRANCHES_PROTEGIDAS[@]}"; then
        falha "Commit direto em '$branch' não é permitido. Crie uma branch e abra um PR."
    else
        vy_ok "Branch '$branch'"
    fi
}
