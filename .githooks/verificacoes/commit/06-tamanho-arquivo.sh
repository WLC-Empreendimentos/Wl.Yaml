# shellcheck shell=bash
# 06 — Bloqueia arquivos acima de VY_TAMANHO_MAX bytes.
export VY_TITULO="Tamanho de arquivo"

vy_verificar() {
    local kb_limite=$((VY_TAMANHO_MAX / 1024))
    local grandes=0 f tam kb
    while IFS= read -r f; do
        [[ -z "$f" || ! -f "$f" ]] && continue
        tam=$(wc -c <"$f" 2>/dev/null || echo 0)
        if (( tam > VY_TAMANHO_MAX )); then
            kb=$(echo "scale=0; $tam / 1024" | bc 2>/dev/null || echo "?")
            falha "Arquivo muito grande: $f (${kb} KB)"
            grandes=1
        fi
    done <<<"$STAGED"
    if [[ $grandes -eq 0 ]]; then
        vy_ok "Todos abaixo do limite (${kb_limite} KB)"
    else
        echo "  Binários grandes devem ficar fora do repositório."
    fi
}
