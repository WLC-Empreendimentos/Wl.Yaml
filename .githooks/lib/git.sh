# shellcheck shell=bash
# ============================================================================
# Wl.Yaml — Helpers de git compartilhados pelos hooks
# ============================================================================

# SHA "vazio" usado pelo git para indicar criação/exclusão de ref.
# shellcheck disable=SC2034
ZERO="0000000000000000000000000000000000000000"

vy_branch_atual() {
    git symbolic-ref --short HEAD 2>/dev/null \
        || git rev-parse --abbrev-ref HEAD 2>/dev/null \
        || echo ""
}

# Lista de arquivos staged (ACM) — um por linha.
vy_staged() {
    git diff --cached --name-only --diff-filter=ACM 2>/dev/null || true
}
