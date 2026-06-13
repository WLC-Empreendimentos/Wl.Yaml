# shellcheck shell=bash
# 07 — Detecta debug leftovers em arquivos TypeScript staged
#      (console.log, debugger, TODO-NOW, ...).
export VY_TITULO="Debug leftovers (TypeScript)"

vy_verificar() {
    local arquivos
    arquivos=$(echo "$STAGED" | grep -E '\.(ts|tsx)$' || true)

    if [[ -z "$arquivos" ]]; then
        vy_pular "Sem arquivos .ts"
        return
    fi

    local enc=0 f suspeitos
    local padrao='(console\.(log|warn|error|debug|trace)\b|debugger\b'
    padrao+='|FIXME-NOW|TODO-NOW|HACK-NOW)'

    while IFS= read -r f; do
        [[ -z "$f" || ! -f "$f" ]] && continue
        suspeitos=$(git diff --cached -U0 -- "$f" \
            | grep -E '^\+' | grep -vE '^\+\+\+' \
            | grep -nE "$padrao" \
            || true)
        if [[ -n "$suspeitos" ]]; then
            falha "Em $f:"
            echo "$suspeitos" | sed 's/^/      /'
            enc=1
        fi
    done <<<"$arquivos"
    [[ $enc -eq 0 ]] && vy_ok "Sem leftovers"
}
