# shellcheck shell=bash
# shellcheck disable=SC2034  # variáveis de parse consumidas pelos scripts de verificação de mensagem
# ============================================================================
# Wl.Yaml — Parser de mensagem de commit (Conventional Commits)
# ============================================================================
# Lê $ARQUIVO_MSG e exporta:
#   MSG_COMPLETA    — texto completo sem comentários e sem linhas em branco finais
#   TITULO          — primeira linha
#   SEGUNDA_LINHA   — segunda linha (deve ser vazia para commits multilinha)
#   TIPO            — tipo Conventional Commits (feat, fix, ...)
#   ESCOPO          — escopo entre parênteses (sem parênteses)
#   BANG            — "!" se breaking change no título, senão vazio
#   DESCRICAO       — texto após "tipo(escopo)?!?: "
#   TITULO_VALIDO   — 0/1; se 0, parâmetros TIPO/ESCOPO/etc não são preenchidos
# ============================================================================

vy_parse_mensagem() {
    MSG_COMPLETA=$(grep -v '^#' "$ARQUIVO_MSG" | sed -e :a -e '/^\n*$/{$d;N;ba' -e '}')
    TITULO=$(echo "$MSG_COMPLETA" | head -1)
    SEGUNDA_LINHA=$(echo "$MSG_COMPLETA" | sed -n '2p')

    local tipos_re
    tipos_re=$(IFS='|'; echo "${VY_TIPOS_VALIDOS[*]}")
    local regex_header="^(${tipos_re})(\([a-z0-9-]+\))?(!)?: .+$"

    if [[ "$TITULO" =~ $regex_header ]]; then
        TIPO=$(echo "$TITULO"  | sed -E "s/^(${tipos_re})(\([a-z0-9-]+\))?(!)?: .+$/\1/")
        local escopo_raw
        escopo_raw=$(echo "$TITULO" | sed -E "s/^(${tipos_re})(\([a-z0-9-]+\))?(!)?: .+$/\2/")
        ESCOPO=${escopo_raw#\(}; ESCOPO=${ESCOPO%\)}
        BANG=$(echo "$TITULO"      | sed -E "s/^(${tipos_re})(\([a-z0-9-]+\))?(!)?: .+$/\3/")
        DESCRICAO=$(echo "$TITULO" | sed -E "s/^(${tipos_re})(\([a-z0-9-]+\))?(!)?: //")
        TITULO_VALIDO=1
    else
        TIPO=""; ESCOPO=""; BANG=""; DESCRICAO=""
        TITULO_VALIDO=0
    fi
}

vy_msg_erro()  { erros+=("$1"); }
vy_msg_aviso() { warns+=("$1"); }
