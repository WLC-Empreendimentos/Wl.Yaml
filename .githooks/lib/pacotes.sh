# shellcheck shell=bash
# Detecção de gerenciador de pacotes do SO + instaladores genéricos.

vy_detectar_pkg_mgr() {
    PKG_MGR=""
    if   command -v apt-get >/dev/null 2>&1; then PKG_MGR="apt"
    elif command -v pacman  >/dev/null 2>&1; then PKG_MGR="pacman"
    elif command -v dnf     >/dev/null 2>&1; then PKG_MGR="dnf"
    elif command -v zypper  >/dev/null 2>&1; then PKG_MGR="zypper"
    fi
    export PKG_MGR
}

vy_nome_pacote() {
    local cmd=$1
    case "$cmd" in
        shellcheck|yamllint) echo "$cmd" ;;
        *) echo "$cmd" ;;
    esac
}

vy_instalar_pkgs_so() {
    [[ $# -eq 0 ]] && return 0
    echo -e "${VY_AZUL}${PKG_MGR:-(nenhum)}:${VY_RESET} $*"
    case "$PKG_MGR" in
        apt)    sudo apt-get update -qq && sudo apt-get install -y "$@" ;;
        pacman) sudo pacman -Sy --noconfirm --needed "$@" ;;
        dnf)    sudo dnf install -y "$@" ;;
        zypper) sudo zypper -n install "$@" ;;
        *)      vy_aviso "Sem gerenciador conhecido — instale manualmente: $*"; return 1 ;;
    esac
}

vy_instalar_npm() {
    [[ $# -eq 0 ]] && return 0
    echo -e "${VY_AZUL}npm:${VY_RESET} $*"
    if ! command -v npm >/dev/null 2>&1; then
        vy_aviso "npm não disponível — instale Node.js primeiro"
        return 1
    fi
    sudo npm install -g "$@"
}

vy_instalar_pip() {
    local p
    for p in "$@"; do
        command -v "$p" >/dev/null 2>&1 && continue
        echo -e "${VY_AZUL}pip:${VY_RESET} $p"
        if   command -v pipx >/dev/null 2>&1; then pipx install "$p"
        elif command -v pip3 >/dev/null 2>&1; then pip3 install --user "$p"
        elif command -v pip  >/dev/null 2>&1; then pip  install --user "$p"
        else vy_aviso "pip/pipx não disponíveis — instale manualmente: $p"
        fi
    done
}
