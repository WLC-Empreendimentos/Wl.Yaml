# shellcheck shell=bash
# 05 — gitleaks no histórico não enviado (commits novos vs remoto).
export VY_TITULO="gitleaks no histórico não enviado"

vy_verificar() {
    if ! command -v gitleaks >/dev/null 2>&1; then
        aviso "gitleaks não instalado — segredos no histórico não serão verificados"
        return
    fi

    local args=(detect --redact --no-banner)
    [[ -f "$RAIZ/.gitleaks.toml" ]] && args+=(--config "$RAIZ/.gitleaks.toml")

    local local_ref _local_sha _remote_ref remote_sha
    while IFS=' ' read -r local_ref _local_sha _remote_ref remote_sha; do
        [[ -z "$local_ref" ]] && continue
        if [[ "$remote_sha" != "$ZERO" ]]; then
            args+=(--log-opts="${remote_sha}..HEAD")
            break
        fi
    done <<<"$LINHAS"

    if gitleaks "${args[@]}" >/tmp/vy-gitleaks-push.log 2>&1; then
        vy_ok "Sem segredos no histórico"
    else
        falha "gitleaks detectou segredos em commits anteriores:"
        head -30 /tmp/vy-gitleaks-push.log | sed 's/^/      /'
    fi
}
