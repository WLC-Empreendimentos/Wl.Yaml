# shellcheck shell=bash
# 05 — Procura segredos no diff (gitleaks; fallback heurístico).
export VY_TITULO="Segredos no diff"

vy_verificar() {
    if command -v gitleaks >/dev/null 2>&1; then
        local args=(protect --staged --redact --no-banner)
        [[ -f "$RAIZ/.gitleaks.toml" ]] && args+=(--config "$RAIZ/.gitleaks.toml")
        if gitleaks "${args[@]}" >/tmp/vy-gitleaks.out 2>&1; then
            vy_ok "gitleaks aprovou"
        else
            falha "gitleaks detectou possíveis segredos"
            sed 's/^/      /' /tmp/vy-gitleaks.out | head -40
            echo "  Para falsos positivos, configure .gitleaks.toml (allowlist)"
        fi
        return
    fi

    aviso "gitleaks não instalado — usando heurística interna (menos preciso)"
    local diff
    diff=$(git diff --cached --diff-filter=ACM -U0 \
        -- ':(exclude).githooks/*' ':(exclude)*.md' ':(exclude)docs/**' 2>/dev/null \
        | grep -E '^\+' | grep -vE '^\+\+\+' || true)

    local q="['\"]"
    local senha_re="(password|senha|secret|api[_-]?key)[[:space:]]*[:=][[:space:]]*${q}[^${q} ]{8,}${q}"
    declare -A padroes=(
        ["AWS Access Key"]='AKIA[0-9A-Z]{16}'
        ["GitHub Token"]='gh[pousr]_[A-Za-z0-9]{36,}'
        ["Google API Key"]='AIza[0-9A-Za-z_-]{35}'
        ["JWT"]='eyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}'
        ["Chave privada"]='BEGIN ([A-Z]+ )?PRIVATE KEY'
        ["Senha hardcoded"]="$senha_re"
    )
    local enc=0 nome
    for nome in "${!padroes[@]}"; do
        if echo "$diff" | grep -qiE -- "${padroes[$nome]}"; then
            falha "Possível '$nome' no diff"
            echo "$diff" | grep -niE -- "${padroes[$nome]}" | head -3 | sed 's/^/      /'
            enc=1
        fi
    done
    [[ $enc -eq 0 ]] && vy_ok "Nenhum segredo aparente (heurística)"
    echo -e "  ${VY_CINZA}Recomendado: instalar gitleaks${VY_RESET}"
}
