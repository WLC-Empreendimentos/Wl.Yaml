#!/usr/bin/env bash
# ============================================================================
# Wl.Yaml — Diagnóstico dos Git Hooks (orquestrador)
# ============================================================================
# Mostra o estado atual da instalação dos hooks e ferramentas auxiliares.
#
#     bash .githooks/diagnostico.sh
# ============================================================================

set -uo pipefail
# shellcheck source-path=SCRIPTDIR

RAIZ=$(git rev-parse --show-toplevel 2>/dev/null) || {
    echo "ERRO: não está em um repositório git"
    exit 1
}
cd "$RAIZ" || exit 1

# shellcheck source=config.sh
source "$RAIZ/.githooks/config.sh"
# shellcheck source=lib/runner.sh
source "$RAIZ/.githooks/lib/runner.sh"
# shellcheck source=lib/ferramentas.sh
source "$RAIZ/.githooks/lib/ferramentas.sh"

vy_iniciar "Diagnóstico dos Git Hooks"

vy_executar_verificacoes "$RAIZ/.githooks/verificacoes/diagnostico"

echo ""
echo -e "${VY_NEGRITO}====================================================${VY_RESET}"
echo ""
