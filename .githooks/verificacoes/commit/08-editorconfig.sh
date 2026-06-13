# shellcheck shell=bash
# 08 — editorconfig-checker em todos os arquivos staged (com cache).
export VY_TITULO="EditorConfig"

vy_verificar() {
    if ! command -v editorconfig-checker >/dev/null 2>&1; then
        aviso "editorconfig-checker não instalado (npm i -g editorconfig-checker)"
        return
    fi

    local para_verificar=() pulados=0 f
    while IFS= read -r f; do
        [[ -z "$f" || ! -f "$f" ]] && continue
        if cache_hit "editorconfig" "$f"; then
            pulados=$((pulados + 1))
        else
            para_verificar+=("$f")
        fi
    done <<<"$STAGED"

    if [[ ${#para_verificar[@]} -eq 0 ]]; then
        vy_ok "Cache hit (todos os $pulados arquivos)"
        return
    fi

    if editorconfig-checker "${para_verificar[@]}" 2>/dev/null; then
        vy_ok "Formato consistente (verificados ${#para_verificar[@]}, cache $pulados)"
        for f in "${para_verificar[@]}"; do cache_set "editorconfig" "$f"; done
    else
        falha "Formato inconsistente com .editorconfig"
    fi
}
