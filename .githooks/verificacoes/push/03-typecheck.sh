# shellcheck shell=bash
# 03 — Verificação de tipos TypeScript (tsc --noEmit).
export VY_TITULO="TypeScript typecheck"

vy_verificar() {
    if [[ ! -f "$RAIZ/node_modules/.bin/tsc" ]]; then
        aviso "tsc não encontrado em node_modules — rode: npm ci"
        return
    fi

    if "$RAIZ/node_modules/.bin/tsc" --noEmit >/tmp/vy-typecheck.out 2>&1; then
        vy_ok "Sem erros de tipo"
    else
        falha "Erros de tipo TypeScript:"
        sed 's/^/      /' /tmp/vy-typecheck.out | head -60
    fi
}
