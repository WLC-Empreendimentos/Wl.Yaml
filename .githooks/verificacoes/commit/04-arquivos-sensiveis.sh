# shellcheck shell=bash
# 04 — Bloqueia arquivos potencialmente sensíveis (.env, *.pem, *.key, ...).
export VY_TITULO="Arquivos sensíveis"

vy_verificar() {
    local regex='(^|/)(\.env(\..+)?|.*\.pem|.*\.pfx|.*\.p12|.*\.key|.*\.keystore'
    regex+='|id_rsa|id_dsa|id_ecdsa|id_ed25519|.*\.gpg|.*\.asc'
    regex+='|.*secrets.*\.(json|yaml|yml))$'
    local excecoes='(\.env\.example|\.env\.sample|\.env\.template)$'

    local sensiveis
    sensiveis=$(echo "$STAGED" | grep -iE "$regex" | grep -ivE "$excecoes" || true)

    if [[ -n "$sensiveis" ]]; then
        local f
        while IFS= read -r f; do falha "Arquivo potencialmente sensível: $f"; done <<<"$sensiveis"
    else
        vy_ok "Nenhum arquivo sensível"
    fi
}
