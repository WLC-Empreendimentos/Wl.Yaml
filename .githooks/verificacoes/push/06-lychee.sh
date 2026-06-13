# shellcheck shell=bash
# 06 — lychee verifica links em todos os *.md rastreados.
export VY_TITULO="lychee (links em Markdown)"

vy_verificar() {
    local lista
    lista=$(git ls-files '*.md' 2>/dev/null \
        | grep -Ev '^(node_modules|dist|out|coverage|_old)/' || true)

    if [[ -z "$lista" ]]; then
        vy_pular "Sem arquivos .md rastreados"
        return
    fi
    if ! command -v lychee >/dev/null 2>&1; then
        aviso "lychee não instalado — links em Markdown não verificados"
        echo "  Instale com: bash .githooks/instalar.sh"
        return
    fi

    local args=(--no-progress)
    if [[ -f "$RAIZ/lychee.toml" ]]; then
        args+=(--config "$RAIZ/lychee.toml")
    else
        args+=(
            --max-concurrency 8
            --timeout 20
            --exclude 'github\.com/cavalcante-willian/Wl.Yaml/actions/workflows'
        )
    fi

    # shellcheck disable=SC2086
    if (cd "$RAIZ" && echo "$lista" | xargs lychee "${args[@]}") >/tmp/vy-lychee.out 2>&1; then
        vy_ok "Todos os links OK"
    else
        falha "lychee encontrou links quebrados:"
        tail -60 /tmp/vy-lychee.out | sed 's/^/      /'
    fi
}
