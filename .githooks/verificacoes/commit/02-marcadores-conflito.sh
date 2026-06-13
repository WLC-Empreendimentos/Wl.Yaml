# shellcheck shell=bash
# 02 — Detecta marcadores de conflito de merge não resolvidos.
export VY_TITULO="Marcadores de merge conflict"

vy_verificar() {
    local conflitos=0 f
    while IFS= read -r f; do
        [[ -z "$f" || ! -f "$f" ]] && continue
        if grep -HnE '^(<{7}|={7}|>{7})( |$)' "$f" >/dev/null 2>&1; then
            falha "Marcador de conflito em: $f"
            conflitos=1
        fi
    done <<<"$STAGED"
    [[ $conflitos -eq 0 ]] && vy_ok "Nenhum marcador encontrado"
}
