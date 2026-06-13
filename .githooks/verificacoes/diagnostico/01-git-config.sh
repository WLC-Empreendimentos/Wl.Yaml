# shellcheck shell=bash
# 01 — Configuração do git (core.hooksPath, user, GPG).
export VY_TITULO="Configuração do git"

vy_verificar() {
    local hooks_path
    hooks_path=$(git config --get core.hooksPath 2>/dev/null || echo "")
    if [[ "$hooks_path" == ".githooks" ]]; then
        vy_ok "core.hooksPath = .githooks"
    else
        vy_falha "core.hooksPath = '${hooks_path:-(não configurado)}'"
        echo "      Rode: bash .githooks/instalar.sh"
    fi

    local user_name user_email
    user_name=$(git config --get user.name 2>/dev/null || echo "")
    user_email=$(git config --get user.email 2>/dev/null || echo "")
    if [[ -n "$user_name" && -n "$user_email" ]]; then
        vy_ok "user.name = $user_name <$user_email>"
    else
        vy_falha "user.name / user.email não configurados"
    fi

    local gpg_sign gpg_key gpg_tem_chave=0
    gpg_sign=$(git config --get commit.gpgsign 2>/dev/null || echo "false")
    gpg_key=$(git config --get user.signingkey 2>/dev/null || echo "")
    if command -v gpg >/dev/null 2>&1; then
        gpg --list-secret-keys --with-colons 2>/dev/null \
            | grep -q '^sec' && gpg_tem_chave=1
    fi
    if [[ "$gpg_sign" == "true" ]]; then
        vy_ok "commit.gpgsign = true (key=${gpg_key:-default})"
    elif [[ $gpg_tem_chave -eq 1 ]]; then
        vy_aviso "commit.gpgsign desligado mas você tem chave GPG"
        echo "      Habilite com: git config commit.gpgsign true"
    else
        vy_pular "commit.gpgsign desligado (sem chave GPG configurada)"
    fi
}
