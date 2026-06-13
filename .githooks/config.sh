# shellcheck shell=bash
# shellcheck disable=SC2034  # variáveis consumidas pelos scripts que sourciam este arquivo
# ============================================================================
# Wl.Yaml — Configuração centralizada dos Git Hooks
# ============================================================================
# Carregado por todos os hooks via:
#     source "$(git rev-parse --show-toplevel)/.githooks/config.sh"
#
# Variáveis de ambiente para opt-in / opt-out (todas opcionais):
#
#   VY_HOOK_FAST=1        Pula etapas pesadas no pre-commit
#   VY_HOOK_TEST=0        Não roda jest no pre-push (default: roda)
#   VY_HOOK_NO_CACHE=1    Desliga cache de validação
#   VY_HOOK_VERBOSE=1     Mostra detalhes de cada etapa
# ============================================================================

# ---------- Branches protegidas (commit direto bloqueado) ------------------
VY_BRANCHES_PROTEGIDAS=(main develop)

# ---------- Padrão válido de nome de branch --------------------------------
# Espelha COMMITS.md §Branches.
VY_BRANCH_PADRAO='^(main|develop|(feat|fix|refactor|docs|build|config|chore)/.+)$'

# ---------- Escopos válidos — espelham COMMITS.md §Escopos ----------------
# Use '*' para aceitar qualquer escopo. Vazio = sem escopo permitido.
VY_ESCOPOS_VALIDOS=(
    nucleo aplicacao infraestrutura apresentacao
    perfil lsp servidor schema formatacao diagnostico completacao hover
    build ci docs config infra testes
)

# ---------- Tipos válidos do Conventional Commits --------------------------
VY_TIPOS_VALIDOS=(feat fix refactor perf docs test build ci chore style revert)

# ---------- Tamanho máximo de arquivo (bytes) ------------------------------
# 1 MB — sem assets grandes neste projeto
VY_TAMANHO_MAX=$((1 * 1024 * 1024))

# ---------- Tamanho máximo do título do commit -----------------------------
VY_COMMIT_TITULO_MAX=72

# ---------- Tamanho sugerido (warning) por linha do corpo ------------------
VY_COMMIT_CORPO_SUGERIDO=100

# ---------- Diretório de cache ---------------------------------------------
VY_CACHE_DIR="$(git rev-parse --git-dir 2>/dev/null)/vy-hooks-cache"

# ---------- Cores ----------------------------------------------------------
if [[ -t 1 ]] || [[ "${FORCE_COLOR:-0}" == "1" ]]; then
    VY_VERMELHO='\033[0;31m'
    VY_VERDE='\033[0;32m'
    VY_AMARELO='\033[1;33m'
    VY_AZUL='\033[0;34m'
    VY_CINZA='\033[0;90m'
    VY_NEGRITO='\033[1m'
    VY_RESET='\033[0m'
else
    VY_VERMELHO='' VY_VERDE='' VY_AMARELO='' VY_AZUL='' VY_CINZA=''
    VY_NEGRITO='' VY_RESET=''
fi

# ---------- Helpers de log -------------------------------------------------
vy_ok()    { echo -e "  ${VY_VERDE}OK${VY_RESET} $1"; }
vy_falha() { echo -e "  ${VY_VERMELHO}FALHOU${VY_RESET} $1"; }
vy_aviso() { echo -e "  ${VY_AMARELO}AVISO${VY_RESET} $1"; }
vy_pular() { echo -e "  ${VY_CINZA}—${VY_RESET} $1"; }
vy_info()  { [[ "${VY_HOOK_VERBOSE:-0}" == "1" ]] && echo -e "  ${VY_CINZA}$1${VY_RESET}"; return 0; }

# ---------- Helper: contém elemento ----------------------------------------
vy_contem() {
    local alvo=$1; shift
    local item
    for item in "$@"; do
        [[ "$item" == "$alvo" ]] && return 0
        [[ "$item" == "*"    ]] && return 0
    done
    return 1
}
