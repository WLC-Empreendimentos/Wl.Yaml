# shellcheck shell=bash
# Download de binários distribuídos como tarballs em GitHub Releases.

vy_baixar_binario() {
    local nome=$1
    local destino=/usr/local/bin
    local arch_uname arch_amd64
    arch_uname=$(uname -m)
    arch_amd64=$arch_uname; [[ "$arch_amd64" == "x86_64" ]] && arch_amd64=amd64

    case "$nome" in
        actionlint) _vy_baixar_actionlint "$destino" ;;
        lychee)     _vy_baixar_lychee     "$destino" "$arch_uname" ;;
        gitleaks)   _vy_baixar_gitleaks   "$destino" "$arch_amd64" ;;
        *)          vy_aviso "Binário desconhecido: $nome"; return 1 ;;
    esac
}

_vy_baixar_actionlint() {
    local destino=$1 tmp
    echo -e "${VY_AZUL}download:${VY_RESET} actionlint"
    tmp=$(mktemp -d)
    local url='https://raw.githubusercontent.com/rhysd/actionlint/main/scripts/download-actionlint.bash'
    ( cd "$tmp" \
        && curl -fsSL "$url" -o dl.sh \
        && bash dl.sh latest "$tmp" >/dev/null \
        && sudo install -m 0755 actionlint "$destino/actionlint" )
    rm -rf "$tmp"
}

_vy_baixar_lychee() {
    local destino=$1 arch=$2 tmp url bin
    echo -e "${VY_AZUL}download:${VY_RESET} lychee (latest)"
    tmp=$(mktemp -d)
    url=$(curl -fsSL https://api.github.com/repos/lycheeverse/lychee/releases/latest \
        | grep -Eo '"browser_download_url": *"[^"]*lychee-'"$arch"'-unknown-linux-gnu\.tar\.gz"' \
        | head -1 | sed 's/.*"\(https[^"]*\)".*/\1/')
    if [[ -z "$url" ]]; then
        vy_aviso "Não encontrei binário Linux para lychee (arch=$arch)"
        rm -rf "$tmp"; return 1
    fi
    ( cd "$tmp" && curl -fsSL "$url" -o lychee.tgz && tar xf lychee.tgz \
        && bin=$(find . -type f -name lychee -perm -u+x | head -1) \
        && sudo install -m 0755 "$bin" "$destino/lychee" )
    rm -rf "$tmp"
}

_vy_baixar_gitleaks() {
    local destino=$1 arch=$2 tmp url
    echo -e "${VY_AZUL}download:${VY_RESET} gitleaks (latest)"
    tmp=$(mktemp -d)
    url=$(curl -fsSL https://api.github.com/repos/gitleaks/gitleaks/releases/latest \
        | grep -Eo '"browser_download_url": *"[^"]*linux_'"$arch"'\.tar\.gz"' \
        | head -1 | sed 's/.*"\(https[^"]*\)".*/\1/')
    if [[ -z "$url" ]]; then
        vy_aviso "Não encontrei binário Linux para gitleaks (arch=$arch)"
        rm -rf "$tmp"; return 1
    fi
    ( cd "$tmp" && curl -fsSL "$url" -o gl.tgz && tar xf gl.tgz \
        && sudo install -m 0755 gitleaks "$destino/gitleaks" )
    rm -rf "$tmp"
}
