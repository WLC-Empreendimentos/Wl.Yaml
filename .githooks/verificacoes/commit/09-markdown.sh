# shellcheck shell=bash
# 09 — markdownlint-cli2 nos *.md staged (com cache).
export VY_TITULO="Markdown lint"

vy_verificar() {
    local arquivos
    arquivos=$(echo "$STAGED" | grep -E '\.md$' || true)

    if [[ -z "$arquivos" ]]; then
        vy_pular "Sem arquivos .md"
        return
    fi
    if ! command -v markdownlint-cli2 >/dev/null 2>&1; then
        aviso "markdownlint-cli2 não instalado (npm i -g markdownlint-cli2) — etapa pulada"
        return
    fi

    local para_lintar=() pulados=0 f
    while IFS= read -r f; do
        [[ -z "$f" || ! -f "$f" ]] && continue
        if cache_hit "markdown" "$f"; then
            pulados=$((pulados + 1))
        else
            para_lintar+=("$f")
        fi
    done <<<"$arquivos"

    if [[ ${#para_lintar[@]} -eq 0 ]]; then
        vy_ok "Cache hit ($pulados arquivos)"
        return
    fi

    if markdownlint-cli2 "${para_lintar[@]}" 2>&1; then
        vy_ok "Markdown válido (verificados ${#para_lintar[@]}, cache $pulados)"
        for f in "${para_lintar[@]}"; do cache_set "markdown" "$f"; done
    else
        falha "Erros de markdown — rode: markdownlint-cli2 --fix"
    fi
}
