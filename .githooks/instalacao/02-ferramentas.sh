# shellcheck shell=bash
# 02 — Verifica todas as ferramentas e aciona instaladores por categoria.

vy_passo() {
    echo ""
    echo -e "${VY_NEGRITO}Ferramentas usadas pelos hooks:${VY_RESET}"
    echo ""

    vy_detectar_pkg_mgr

    local PKGS_SO=() NPM_PKGS=() PIP_PKGS=() BIN_DOWNLOAD=()

    _classificar() {
        local cmd=$1 obrig=$2 fonte=$3 hint=$4
        vy_verificar_cmd "$cmd" "$obrig" "$hint" && return 0
        case "$fonte" in
            pkg)     PKGS_SO+=("$(vy_nome_pacote "$cmd")") ;;
            npm)     NPM_PKGS+=("$cmd") ;;
            pip)     PIP_PKGS+=("$cmd") ;;
            binario) BIN_DOWNLOAD+=("$cmd") ;;
        esac
        [[ "$cmd" == "yamllint" ]] && PIP_PKGS+=("yamllint")
    }
    vy_para_cada_ferramenta _classificar

    local total=$(( ${#PKGS_SO[@]} + ${#NPM_PKGS[@]} + ${#PIP_PKGS[@]} + ${#BIN_DOWNLOAD[@]} ))
    [[ $total -eq 0 ]] && return 0

    echo ""
    echo -e "${VY_NEGRITO}Instalação automática${VY_RESET}"
    echo ""

    if [[ ${#PKGS_SO[@]} -gt 0 ]]; then
        local UNIQ
        mapfile -t UNIQ < <(printf '%s\n' "${PKGS_SO[@]}" | awk 'NF && !seen[$0]++')
        vy_instalar_pkgs_so "${UNIQ[@]}" && vy_ok "pacotes do SO instalados"
    fi
    if [[ ${#NPM_PKGS[@]} -gt 0 ]]; then
        vy_instalar_npm "${NPM_PKGS[@]}" && vy_ok "pacotes npm instalados"
    fi
    [[ ${#PIP_PKGS[@]} -gt 0 ]] && vy_instalar_pip "${PIP_PKGS[@]}"

    local b
    for b in "${BIN_DOWNLOAD[@]}"; do vy_baixar_binario "$b" || true; done
}
