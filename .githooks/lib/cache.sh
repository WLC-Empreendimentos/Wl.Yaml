# shellcheck shell=bash
# ============================================================================
# Wl.Yaml — Cache de validações por hash de arquivo
# ============================================================================
# cache_hit <etapa> <arquivo>  → 0 se já validado nesta versão (hash)
# cache_set <etapa> <arquivo>  → grava hash como aprovado
# Marcador fica em $VY_CACHE_DIR/<etapa>.list (linhas "<hash>:<arquivo>").
# Desligado por VY_HOOK_NO_CACHE=1.
# ============================================================================

mkdir -p "$VY_CACHE_DIR" 2>/dev/null || true

cache_hit() {
    [[ "${VY_HOOK_NO_CACHE:-0}" == "1" ]] && return 1
    local etapa=$1 arquivo=$2
    local marca="$VY_CACHE_DIR/${etapa}.list"
    [[ ! -f "$marca" ]] && return 1
    local hash
    hash=$(git hash-object "$arquivo" 2>/dev/null) || return 1
    grep -qxF "${hash}:${arquivo}" "$marca"
}

cache_set() {
    [[ "${VY_HOOK_NO_CACHE:-0}" == "1" ]] && return 0
    local etapa=$1 arquivo=$2
    local marca="$VY_CACHE_DIR/${etapa}.list"
    local hash
    hash=$(git hash-object "$arquivo" 2>/dev/null) || return 0
    grep -qxF "${hash}:${arquivo}" "$marca" 2>/dev/null && return 0
    echo "${hash}:${arquivo}" >>"$marca"
}
