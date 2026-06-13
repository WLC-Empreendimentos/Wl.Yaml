# shellcheck shell=bash
# 12 — yamllint em qualquer *.yml/*.yaml staged.
export VY_TITULO="yamllint"

vy_verificar() {
    local arquivos
    arquivos=$(echo "$STAGED" | grep -E '\.(yml|yaml)$' || true)

    if [[ -z "$arquivos" ]]; then
        vy_pular "Sem arquivos YAML"
        return
    fi
    if ! command -v yamllint >/dev/null 2>&1; then
        falha "yamllint não instalado (pip install yamllint)"
        return
    fi

    local args=()
    [[ -f "$RAIZ/.yamllint" || -f "$RAIZ/.yamllint.yml" || -f "$RAIZ/.yamllint.yaml" ]] \
        || args+=(-d 'relaxed')

    # shellcheck disable=SC2086
    if yamllint "${args[@]}" $arquivos >/tmp/vy-yamllint.out 2>&1; then
        vy_ok "YAML válido"
    else
        falha "yamllint reportou problemas:"
        sed 's/^/      /' /tmp/vy-yamllint.out | head -60
    fi
}
