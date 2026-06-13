# shellcheck shell=bash
# Lista canônica de ferramentas usadas pelos hooks + helper de verificação.
#
# Formato de cada entrada (separadas por '|'):
#   cmd | obrigatorio(sim/nao) | fonte | hint
#
# fonte: pkg | npm | pip | binario | manual

VY_FERRAMENTAS=(
    "node|sim|manual|nodejs.org ou nvm"
    "npm|sim|manual|vem com Node.js"
    "actionlint|sim|binario|binário em /usr/local/bin"
    "yamllint|sim|pkg|via gerenciador (fallback: pip install yamllint)"
    "shellcheck|sim|pkg|via gerenciador"
    "markdownlint-cli2|sim|npm|npm install -g markdownlint-cli2"
    "editorconfig-checker|sim|npm|npm install -g editorconfig-checker"
    "gitleaks|sim|binario|binário em /usr/local/bin"
    "lychee|nao|binario|binário em /usr/local/bin (usado no pre-push)"
)

vy_verificar_cmd() {
    local cmd=$1 obrigatorio=$2 hint=$3
    if command -v "$cmd" >/dev/null 2>&1; then
        local versao
        versao=$("$cmd" --version 2>&1 | head -1 || echo "?")
        vy_ok "$cmd ($versao)"
        return 0
    fi
    if [[ "$obrigatorio" == "sim" ]]; then
        vy_falha "$cmd ausente — $hint"
    else
        vy_aviso "$cmd ausente — $hint"
    fi
    return 1
}

vy_para_cada_ferramenta() {
    local fn=$1 entrada cmd obrig fonte hint
    for entrada in "${VY_FERRAMENTAS[@]}"; do
        IFS='|' read -r cmd obrig fonte hint <<<"$entrada"
        "$fn" "$cmd" "$obrig" "$fonte" "$hint"
    done
}
