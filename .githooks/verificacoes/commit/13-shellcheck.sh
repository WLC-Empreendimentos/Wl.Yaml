# shellcheck shell=bash
# 13 — shellcheck em qualquer *.sh staged.
export VY_TITULO="shellcheck"

vy_verificar() {
    local arquivos
    arquivos=$(echo "$STAGED" | grep -E '\.sh$' || true)

    if [[ -z "$arquivos" ]]; then
        vy_pular "Sem arquivos .sh"
        return
    fi
    if ! command -v shellcheck >/dev/null 2>&1; then
        falha "shellcheck não instalado (apt install shellcheck)"
        return
    fi

    local sh_falhou=0 f
    : >/tmp/vy-shellcheck.out
    while IFS= read -r f; do
        [[ -z "$f" || ! -f "$f" ]] && continue
        if ! shellcheck -x --severity=warning --exclude=SC1091,SC2034 \
            "$f" >>/tmp/vy-shellcheck.out 2>&1; then
            sh_falhou=1
        fi
    done <<<"$arquivos"

    if [[ $sh_falhou -eq 0 ]]; then
        vy_ok "Shell scripts OK"
    else
        falha "shellcheck reportou problemas:"
        sed 's/^/      /' /tmp/vy-shellcheck.out | head -80
    fi
}
