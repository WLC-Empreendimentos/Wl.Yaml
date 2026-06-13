# shellcheck shell=bash
# 10 — ESLint nos arquivos .ts staged.
#      Pulado em modo FAST (VY_HOOK_FAST=1).
export VY_TITULO="ESLint (TypeScript)"

vy_verificar() {
    local arquivos
    arquivos=$(echo "$STAGED" | grep -E '\.ts$' || true)

    if [[ -z "$arquivos" ]]; then
        vy_pular "Sem arquivos .ts"
        return
    fi

    if [[ "${VY_HOOK_FAST:-0}" == "1" ]]; then
        vy_pular "Modo FAST — ESLint pulado"
        return
    fi

    if [[ ! -f "$RAIZ/node_modules/.bin/eslint" ]]; then
        aviso "ESLint não encontrado em node_modules — rode: npm ci"
        return
    fi

    # shellcheck disable=SC2086
    if "$RAIZ/node_modules/.bin/eslint" --max-warnings=0 $arquivos \
        >/tmp/vy-eslint.out 2>&1; then
        vy_ok "ESLint aprovado"
    else
        falha "ESLint reportou problemas:"
        sed 's/^/      /' /tmp/vy-eslint.out | head -80
    fi
}
