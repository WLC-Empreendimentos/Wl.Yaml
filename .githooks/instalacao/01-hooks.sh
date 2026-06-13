# shellcheck shell=bash
# 01 — Configura core.hooksPath e permissões de execução.

vy_passo() {
    git config core.hooksPath .githooks
    vy_ok "core.hooksPath configurado para .githooks"

    local hook
    for hook in pre-commit prepare-commit-msg commit-msg pre-push pre-rebase \
        instalar.sh diagnostico.sh; do
        chmod +x "$RAIZ/.githooks/$hook"
    done
    vy_ok "Permissões de execução aplicadas"
}
