# shellcheck shell=bash
# 01 — Bloqueia push em branches protegidas + detecta force push.
export VY_TITULO="Branch destino"

vy_verificar() {
    forcado=0
    branches_destino=()

    local local_ref local_sha remote_ref remote_sha branch_nome
    while IFS=' ' read -r local_ref local_sha remote_ref remote_sha; do
        [[ -z "$local_ref" ]] && continue
        branch_nome=${remote_ref##refs/heads/}
        branches_destino+=("$branch_nome")

        if vy_contem "$branch_nome" "${VY_BRANCHES_PROTEGIDAS[@]}"; then
            falha "Push direto para branch protegida '$branch_nome' não é permitido. Use Pull Request."
        fi

        if [[ "$local_sha" != "$ZERO" && "$remote_sha" != "$ZERO" ]]; then
            if ! git merge-base --is-ancestor "$remote_sha" "$local_sha" 2>/dev/null; then
                forcado=1
                if vy_contem "$branch_nome" "${VY_BRANCHES_PROTEGIDAS[@]}"; then
                    falha "Force push detectado em branch protegida '$branch_nome'"
                else
                    aviso "Force push detectado em '$branch_nome' (permitido em branch de feature)"
                fi
            fi
        fi
    done <<<"$LINHAS"

    # shellcheck disable=SC2154
    [[ $falhou -eq 0 && $forcado -eq 0 ]] \
        && vy_ok "Branches OK: ${branches_destino[*]:-nenhuma}"
}
