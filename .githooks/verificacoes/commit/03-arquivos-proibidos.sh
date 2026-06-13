# shellcheck shell=bash
# 03 — Bloqueia artefatos de build / lixo versionados por engano.
export VY_TITULO="Arquivos proibidos"

vy_verificar() {
    local regex='(^|/)(\.DS_Store|Thumbs\.db|desktop\.ini|.*\.swp|.*\.swo|.*~|.*\.bak|.*\.orig)$'
    regex+='|(^|/)(dist|out|coverage|node_modules)/'
    local lixo
    lixo=$(echo "$STAGED" | grep -iE "$regex" || true)

    if [[ -n "$lixo" ]]; then
        local f
        while IFS= read -r f; do falha "Versionado indevidamente: $f"; done <<<"$lixo"
        echo "  Adicione o padrão ao .gitignore e remova com: git rm --cached <arquivo>"
    else
        vy_ok "Nenhum arquivo proibido"
    fi
}
