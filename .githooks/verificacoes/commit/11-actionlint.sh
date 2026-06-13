# shellcheck shell=bash
# 11 — actionlint em workflows .github/workflows/*.yml staged.
export VY_TITULO="actionlint (workflows)"

vy_verificar() {
    local arquivos
    arquivos=$(echo "$STAGED" | grep -E '^\.github/workflows/.+\.ya?ml$' || true)

    if [[ -z "$arquivos" ]]; then
        vy_pular "Sem workflows alterados"
        return
    fi
    if ! command -v actionlint >/dev/null 2>&1; then
        falha "actionlint não instalado (necessário para validar workflows)"
        echo "  Instale com: bash .githooks/instalar.sh"
        return
    fi

    # shellcheck disable=SC2086
    if actionlint $arquivos >/tmp/vy-actionlint.out 2>&1; then
        vy_ok "Workflows válidos"
    else
        falha "actionlint reportou problemas:"
        sed 's/^/      /' /tmp/vy-actionlint.out | head -60
    fi
}
