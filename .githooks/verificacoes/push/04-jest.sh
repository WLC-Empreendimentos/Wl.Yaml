# shellcheck shell=bash
# 04 — Testes unitários com Jest.
#      Pulado com VY_HOOK_TEST=0.
export VY_TITULO="Jest (testes unitários)"

vy_verificar() {
    if [[ "${VY_HOOK_TEST:-1}" == "0" ]]; then
        vy_pular "VY_HOOK_TEST=0 — testes pulados"
        return
    fi

    if [[ ! -f "$RAIZ/node_modules/.bin/jest" ]]; then
        aviso "jest não encontrado em node_modules — rode: npm ci"
        return
    fi

    if "$RAIZ/node_modules/.bin/jest" --ci --no-coverage \
        >/tmp/vy-jest.out 2>&1; then
        vy_ok "Todos os testes passaram"
    else
        falha "Testes falharam:"
        sed 's/^/      /' /tmp/vy-jest.out | tail -60
    fi
}
