# shellcheck shell=bash
# ============================================================================
# Wl.Yaml — Runner: orquestração comum dos hooks
# ============================================================================

falhou=0
avisos=0
step=0
total_steps=0

vy_iniciar() {
    local nome=$1
    echo ""
    echo -e "${VY_NEGRITO}===================================================="
    echo "  Wl.Yaml — ${nome}"
    echo -e "====================================================${VY_RESET}"
}

passo() {
    step=$((step + 1))
    printf '\n%b[%02d/%02d]%b %b%s%b\n' \
        "$VY_AZUL" "$step" "$total_steps" "$VY_RESET" \
        "$VY_NEGRITO" "$1" "$VY_RESET"
}

falha() { vy_falha "$1"; falhou=1; }
aviso() { vy_aviso "$1"; avisos=$((avisos + 1)); }

vy_finalizar() {
    local rotulo=$1
    local bypass=$2

    echo ""
    echo -e "${VY_NEGRITO}====================================================${VY_RESET}"

    if [[ $falhou -eq 1 ]]; then
        echo -e "${VY_VERMELHO}${VY_NEGRITO}  ${rotulo} BLOQUEADO${VY_RESET} — corrija os erros acima"
        echo -e "${VY_NEGRITO}====================================================${VY_RESET}"
        echo ""
        echo "  Para forçar (NÃO recomendado): $bypass"
        echo ""
        exit 1
    fi

    if [[ $avisos -gt 0 ]]; then
        echo -e "${VY_AMARELO}${VY_NEGRITO}  ${rotulo} OK${VY_RESET} (com $avisos aviso(s))"
    else
        echo -e "${VY_VERDE}${VY_NEGRITO}  ${rotulo} OK${VY_RESET}"
    fi
    echo -e "${VY_NEGRITO}====================================================${VY_RESET}"
    echo ""
    exit 0
}

vy_executar_verificacoes() {
    local diretorio=$1
    if [[ ! -d "$diretorio" ]]; then
        echo "ERRO: diretório de verificações não encontrado: $diretorio" >&2
        exit 2
    fi

    local arquivos=()
    while IFS= read -r f; do
        arquivos+=("$f")
    done < <(find "$diretorio" -maxdepth 1 -type f -name '*.sh' | sort)

    total_steps=${#arquivos[@]}

    local arquivo
    for arquivo in "${arquivos[@]}"; do
        unset VY_TITULO
        unset -f vy_verificar 2>/dev/null || true
        # shellcheck source=/dev/null
        source "$arquivo"
        if [[ -z "${VY_TITULO:-}" ]]; then
            echo "ERRO: $arquivo não definiu VY_TITULO" >&2
            exit 2
        fi
        if ! declare -f vy_verificar >/dev/null; then
            echo "ERRO: $arquivo não definiu vy_verificar" >&2
            exit 2
        fi
        passo "$VY_TITULO"
        vy_verificar
    done
}

vy_executar_passos() {
    local diretorio=$1
    if [[ ! -d "$diretorio" ]]; then
        echo "ERRO: diretório de passos não encontrado: $diretorio" >&2
        exit 2
    fi
    local arquivo
    while IFS= read -r arquivo; do
        unset -f vy_passo 2>/dev/null || true
        # shellcheck source=/dev/null
        source "$arquivo"
        if ! declare -f vy_passo >/dev/null; then
            echo "ERRO: $arquivo não definiu vy_passo" >&2
            exit 2
        fi
        vy_passo
    done < <(find "$diretorio" -maxdepth 1 -type f -name '*.sh' | sort)
}
