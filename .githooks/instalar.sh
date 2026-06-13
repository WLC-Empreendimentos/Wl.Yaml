#!/usr/bin/env bash
# ============================================================================
# Wl.Yaml — Instalação dos Git Hooks (orquestrador)
# ============================================================================
# Use UMA vez após clonar:    bash .githooks/instalar.sh
# Para validar depois:        bash .githooks/diagnostico.sh
# ============================================================================

set -e
# shellcheck source-path=SCRIPTDIR

RAIZ=$(git rev-parse --show-toplevel)
cd "$RAIZ"

# shellcheck source=config.sh
source "$RAIZ/.githooks/config.sh"
# shellcheck source=lib/runner.sh
source "$RAIZ/.githooks/lib/runner.sh"
# shellcheck source=lib/ferramentas.sh
source "$RAIZ/.githooks/lib/ferramentas.sh"
# shellcheck source=lib/pacotes.sh
source "$RAIZ/.githooks/lib/pacotes.sh"
# shellcheck source=lib/binarios.sh
source "$RAIZ/.githooks/lib/binarios.sh"

vy_iniciar "Instalação dos Git Hooks"

vy_executar_passos "$RAIZ/.githooks/instalacao"
